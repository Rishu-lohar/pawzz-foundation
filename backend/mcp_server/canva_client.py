from __future__ import annotations

import asyncio
import io
import json
import logging
import os
import re
import secrets
import uuid
import zipfile
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

import httpx2
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse, Response
from mcp import ClientSession
from mcp.client.auth import AuthorizationCodeResult, OAuthClientProvider, TokenStorage
from mcp.client.streamable_http import streamable_http_client
from mcp.shared.auth import OAuthClientInformationFull, OAuthClientMetadata, OAuthToken
from pydantic import AnyUrl, BaseModel, Field

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
CANVA_MCP_URL = os.getenv("CANVA_MCP_URL", "https://api.canva.com/connect/v1/mcp")
router = APIRouter()
logger = logging.getLogger(__name__)


def _safe_canva_error(error: Exception) -> str:
    if isinstance(error, BaseExceptionGroup):
        message = "; ".join(_safe_canva_error(item) for item in error.exceptions)[:600]
    else:
        message = str(error)[:600]
    message = re.sub(r"https://[^\s'\"]+", "[Canva endpoint]", message)
    message = re.sub(r"(?i)(authorization\s*:\s*bearer\s+)[^\s]+", r"\1[redacted]", message)
    message = re.sub(r"(?i)(access_token|refresh_token|code|state)=([^&\s]+)", r"\1=[redacted]", message)
    return f"{type(error).__name__}: {message}" if message else type(error).__name__


class CanvaTokenStorage(TokenStorage):
    """Keep Canva credentials in this local backend process only."""

    def __init__(self) -> None:
        self.tokens: OAuthToken | None = None
        self.client_info: OAuthClientInformationFull | None = None

    async def get_tokens(self) -> OAuthToken | None:
        return self.tokens

    async def set_tokens(self, tokens: OAuthToken) -> None:
        self.tokens = tokens

    async def get_client_info(self) -> OAuthClientInformationFull | None:
        return self.client_info

    async def set_client_info(self, client_info: OAuthClientInformationFull) -> None:
        self.client_info = client_info


storage = CanvaTokenStorage()
jobs: dict[str, dict[str, Any]] = {}
state_to_job: dict[str, str] = {}


class SlideInput(BaseModel):
    headline: str = Field(min_length=1, max_length=180)
    body: str = Field(min_length=1, max_length=600)
    visual_direction: str = Field(default="", max_length=300)


class CreateDesignRequest(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    platform: str = Field(default="Instagram", max_length=40)
    audience: str = Field(default="Pet parents", max_length=120)
    tone: str = Field(default="Friendly and educational", max_length=120)
    slides: list[SlideInput] = Field(min_length=3, max_length=10)
    caption: str = Field(default="", max_length=1000)
    cta: str = Field(default="", max_length=500)


class AdoptDesignRequest(BaseModel):
    design_id: str = Field(pattern=r"^D[A-Za-z0-9_-]{9,}$", max_length=80)
    edit_url: str = Field(pattern=r"^https://www\.canva\.com/design/", max_length=500)


def _decode_result(result: Any) -> dict[str, Any]:
    if getattr(result, "isError", False):
        messages = [getattr(item, "text", "") for item in getattr(result, "content", []) or []]
        raise RuntimeError("Canva MCP error: " + "; ".join(message for message in messages if message)[:500])
    structured = getattr(result, "structuredContent", None)
    if isinstance(structured, dict):
        return structured
    raw_messages = []
    for item in getattr(result, "content", []) or []:
        text = getattr(item, "text", None)
        if text:
            raw_messages.append(text[:500])
            try:
                decoded = json.loads(text)
                if isinstance(decoded, dict):
                    return decoded
            except json.JSONDecodeError:
                stripped = text.strip().removeprefix("```json").removesuffix("```").strip()
                try:
                    decoded = json.loads(stripped)
                    if isinstance(decoded, dict):
                        return decoded
                except json.JSONDecodeError:
                    pass
    raise RuntimeError("Canva MCP returned an unrecognized response: " + "; ".join(raw_messages)[:500])


def _credentials() -> tuple[str, str, str]:
    client_id = os.getenv("CANVA_CLIENT_ID", "").strip()
    client_secret = os.getenv("CANVA_CLIENT_SECRET", "").strip()
    redirect_uri = os.getenv("CANVA_REDIRECT_URI", "").strip()
    if not all((client_id, client_secret, redirect_uri)):
        raise HTTPException(503, "Set CANVA_CLIENT_ID, CANVA_CLIENT_SECRET, and CANVA_REDIRECT_URI in backend/.env.")
    return client_id, client_secret, redirect_uri


async def _open_session(job_id: str, redirect_uri: str, client_id: str, client_secret: str):
    async def redirect_handler(url: str) -> None:
        parsed = parse_qs(urlparse(url).query)
        state = parsed.get("state", [""])[0]
        if not state:
            raise RuntimeError("Canva OAuth authorization URL did not include state.")
        state_to_job[state] = job_id
        jobs[job_id]["authorization_url"] = url
        jobs[job_id]["status"] = "authorization_required"
        jobs[job_id]["auth_ready"].set()

    async def callback_handler() -> AuthorizationCodeResult:
        return await jobs[job_id]["callback_future"]

    metadata = OAuthClientMetadata(
        client_name="Pawzz AI Studio",
        redirect_uris=[AnyUrl(redirect_uri)],
        grant_types=["authorization_code", "refresh_token"],
        response_types=["code"],
        scope="",
    )
    await storage.set_client_info(OAuthClientInformationFull(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uris=[AnyUrl(redirect_uri)],
        grant_types=["authorization_code", "refresh_token"],
        response_types=["code"],
        token_endpoint_auth_method="client_secret_basic",
    ))
    oauth = OAuthClientProvider(
        server_url=CANVA_MCP_URL,
        client_metadata=metadata,
        storage=storage,
        redirect_handler=redirect_handler,
        callback_handler=callback_handler,
    )
    client = httpx2.AsyncClient(auth=oauth, timeout=httpx2.Timeout(60, read=600))
    return client, oauth


async def _run_design(job_id: str, request: CreateDesignRequest, credentials: tuple[str, str, str]) -> None:
    client_id, client_secret, redirect_uri = credentials
    job = jobs[job_id]
    try:
        http_client, _ = await _open_session(job_id, redirect_uri, client_id, client_secret)
        try:
            async with http_client:
                async with streamable_http_client(CANVA_MCP_URL, http_client=http_client) as (read_stream, write_stream):
                    async with ClientSession(read_stream, write_stream) as session:
                        await session.initialize()
                        job["status"] = "creating_design"
                        brief = [
                            f"Create an editable {len(request.slides)}-page {request.platform} carousel for Pawzz Foundation.",
                            f"Title: {request.title}", f"Audience: {request.audience}", f"Tone: {request.tone}",
                            "Use a warm, accessible animal-welfare visual style with clear typography, short copy, and a distinct but consistent layout on every page.",
                            "Include relevant animal imagery on each page (pets, carriers, gentle handling, vet visits, and pet rewards as appropriate). Use Canva's available image assets; do not use unrelated stock imagery.",
                            "Keep headlines and body copy readable, preserve the text exactly, and avoid adding unsupported factual claims.",
                            *[f"Page {i}: {slide.headline}\n{slide.body}\nVisual direction: {slide.visual_direction}" for i, slide in enumerate(request.slides, 1)],
                            f"Caption: {request.caption}", f"Closing call to action: {request.cta}",
                            "Provide an editable Canva design, not a flattened image.",
                        ]
                        created = _decode_result(await session.call_tool("create-design", {
                            "brief": "\n\n".join(brief),
                            "format": f"{request.platform} Carousel (4:5 portrait pages)",
                        }))
                        design = created.get("design")
                        if not design:
                            job["status"] = "design_processing"
                            job_id_remote = created.get("job_id")
                            continuation = created.get("continuation_token")
                            if not job_id_remote or not continuation:
                                raise RuntimeError("Canva did not return a design or a generation job.")
                            for _ in range(40):
                                policy = created.get("polling_policy") or {}
                                await asyncio.sleep(max(1, min(int(policy.get("wait_seconds", 15)), 60)))
                                created = _decode_result(await session.call_tool("get-create-design-async-job", {
                                    "job_id": job_id_remote,
                                    "continuation_token": continuation,
                                }))
                                status = created.get("status")
                                if status == "completed":
                                    design = created.get("design")
                                    break
                                if status == "failed":
                                    failure = created.get("failure") or {}
                                    raise RuntimeError(failure.get("message") or "Canva design creation failed.")
                                continuation = created.get("continuation_token", continuation)
                            if not design:
                                raise RuntimeError("Canva design creation is still pending. Check the job again later.")
                        job["design_id"] = design.get("id")
                        job["edit_url"] = design.get("edit_url") or design.get("url")
                        if not job["design_id"] or not job["edit_url"]:
                            raise RuntimeError("Canva completed the request without returning an editable design link.")
                        try:
                            pages = _decode_result(await session.call_tool("get-design-pages", {"design_id": job["design_id"]}))
                            page_items = pages.get("items", [])
                            if len(page_items) != len(request.slides):
                                raise RuntimeError(f"Canva created {len(page_items)} pages; expected {len(request.slides)}.")
                            job["thumbnails"] = [item.get("thumbnail", {}).get("url") for item in page_items if item.get("thumbnail", {}).get("url")]
                            job["page_count"] = len(page_items)
                        except Exception:
                            raise
                        job["status"] = "completed"
        finally:
            if not http_client.is_closed:
                await http_client.aclose()
    except Exception as error:
        message = str(error)
        if "invalid_grant" in message.lower():
            job["error"] = "Canva rejected this OAuth grant. Start a fresh authorization and confirm the redirect URL exactly matches the Canva Developer Portal entry."
            storage.tokens = None
        else:
            job["error"] = "Canva MCP could not complete the design request. Check the Canva app configuration and retry."
        job["status"] = "failed"
    finally:
        job["auth_ready"].set()


async def _run_adopt_design(job_id: str, design_id: str, edit_url: str, credentials: tuple[str, str, str]) -> None:
    client_id, client_secret, redirect_uri = credentials
    job = jobs[job_id]
    try:
        http_client, _ = await _open_session(job_id, redirect_uri, client_id, client_secret)
        try:
            async with http_client:
                async with streamable_http_client(CANVA_MCP_URL, http_client=http_client) as (read_stream, write_stream):
                    async with ClientSession(read_stream, write_stream) as session:
                        await session.initialize()
                        job["status"] = "checking_design"
                        pages = _decode_result(await session.call_tool("get-design-pages", {"design_id": design_id}))
                        thumbnails = [item.get("thumbnail", {}).get("url") for item in pages.get("items", []) if item.get("thumbnail", {}).get("url")]
                        page_items = pages.get("items", [])
                        if len(page_items) != 5:
                            raise RuntimeError(f"Existing Canva design has {len(page_items)} pages; expected five.")
                        job.update(status="completed", design_id=design_id, edit_url=edit_url, thumbnails=thumbnails, page_count=len(page_items))
        finally:
            if not http_client.is_closed:
                await http_client.aclose()
    except Exception as error:
        logger.exception("Could not connect existing Canva design")
        job["error"] = str(error)[:500] or "Could not connect the existing Canva design."
        job["status"] = "failed"
    finally:
        job["auth_ready"].set()


@router.get("/auth/canva/callback", response_class=HTMLResponse)
async def canva_oauth_callback(code: str = "", state: str = "", iss: str | None = None, error: str | None = None):
    job_id = state_to_job.pop(state, None)
    if not job_id or job_id not in jobs:
        return HTMLResponse("<h1>Canva connection expired</h1><p>Return to Pawzz and start the Canva connection again.</p>", status_code=400)
    if error:
        jobs[job_id]["error"] = "Canva authorization was declined. Return to Pawzz and try again if you want to connect."
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["callback_future"].set_exception(RuntimeError("Authorization declined"))
    elif not code:
        return HTMLResponse("<h1>Canva did not return an authorization code</h1><p>Return to Pawzz and start the connection again.</p>", status_code=400)
    else:
        jobs[job_id]["callback_future"].set_result(AuthorizationCodeResult(code=code, state=state, iss=iss))
    return HTMLResponse("<h1>Canva connected</h1><p>Return to the Pawzz tab to check your design status.</p>")


@router.post("/api/canva/create-design")
async def create_canva_design(request: CreateDesignRequest):
    credentials = _credentials()
    job_id = uuid.uuid4().hex
    jobs[job_id] = {
        "status": "starting", "authorization_url": None, "edit_url": None,
        "design_id": None, "thumbnails": [], "error": None,
        "auth_ready": asyncio.Event(), "callback_future": asyncio.get_running_loop().create_future(),
    }
    asyncio.create_task(_run_design(job_id, request, credentials))
    try:
        await asyncio.wait_for(jobs[job_id]["auth_ready"].wait(), timeout=4)
    except asyncio.TimeoutError:
        pass
    job = jobs[job_id]
    return {
        "job_id": job_id, "status": job["status"],
        "authorization_url": job["authorization_url"],
        "edit_url": job["edit_url"], "error": job["error"],
    }


@router.get("/api/canva/jobs/{job_id}")
async def get_canva_job(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Canva job was not found. Start the design workflow again.")
    return {key: job.get(key) for key in ("status", "authorization_url", "edit_url", "thumbnails", "page_count", "error")}


@router.post("/api/canva/adopt-design")
async def adopt_canva_design(request: AdoptDesignRequest):
    credentials = _credentials()
    job_id = uuid.uuid4().hex
    jobs[job_id] = {
        "status": "starting", "authorization_url": None, "edit_url": None,
        "design_id": None, "thumbnails": [], "error": None,
        "auth_ready": asyncio.Event(), "callback_future": asyncio.get_running_loop().create_future(),
    }
    asyncio.create_task(_run_adopt_design(job_id, request.design_id, request.edit_url, credentials))
    try:
        await asyncio.wait_for(jobs[job_id]["auth_ready"].wait(), timeout=4)
    except asyncio.TimeoutError:
        pass
    job = jobs[job_id]
    return {key: job.get(key) for key in ("status", "authorization_url", "edit_url", "error")} | {"job_id": job_id}


@router.post("/api/canva/jobs/{job_id}/export")
async def export_canva_design(job_id: str, file_format: str = "png"):
    if file_format not in {"png", "pdf"}:
        raise HTTPException(400, "Export format must be png or pdf.")
    job = jobs.get(job_id)
    if not job or job.get("status") != "completed" or not job.get("design_id"):
        raise HTTPException(409, "Create a Canva design before exporting.")
    client_id, client_secret, redirect_uri = _credentials()
    http_client, _ = await _open_session(job_id, redirect_uri, client_id, client_secret)
    try:
        async with http_client:
            async with streamable_http_client(CANVA_MCP_URL, http_client=http_client) as (read_stream, write_stream):
                async with ClientSession(read_stream, write_stream) as session:
                    await session.initialize()
                    try:
                        formats_result = _decode_result(await session.call_tool("get-export-formats", {"design_id": job["design_id"]}))
                    except Exception as error:
                        raise RuntimeError(f"get-export-formats: {_safe_canva_error(error)}") from error
                    supported_pages = (formats_result.get("formats") or {}).get(file_format, {}).get("page_numbers", [])
                    if supported_pages and not set(range(1, 6)).issubset(set(supported_pages)):
                        raise HTTPException(409, f"Canva {file_format.upper()} format does not include all five carousel pages.")
                    try:
                        result = _decode_result(await session.call_tool("export-design", {
                            "design_id": job["design_id"],
                            "format": {"type": file_format, "pages": [1, 2, 3, 4, 5]},
                        }))
                    except Exception as error:
                        raise RuntimeError(f"export-design: {_safe_canva_error(error)}") from error
                    export_job = result.get("job") or result
                    if export_job.get("status") not in (None, "success", "completed"):
                        raise HTTPException(502, f"Canva {file_format.upper()} export status: {export_job.get('status')}.")
                    urls = export_job.get("urls") or []
                    if not urls:
                        raise HTTPException(502, "Canva did not return a downloadable export link.")
                    output = []
                    async with httpx2.AsyncClient(follow_redirects=True, timeout=90) as downloader:
                        for url in urls:
                            parsed = urlparse(url)
                            hostname = parsed.hostname or ""
                            if parsed.scheme != "https" or not (hostname == "canva.com" or hostname.endswith(".canva.com")):
                                raise HTTPException(502, "Canva returned an unsafe export URL.")
                            file_response = await downloader.get(url)
                            file_response.raise_for_status()
                            output.append((parsed.path.rsplit("/", 1)[-1] or f"carousel.{file_format}", file_response.content))
                    if file_format == "pdf":
                        if len(output) != 1 or not output[0][1].startswith(b"%PDF-"):
                            raise HTTPException(502, "Canva did not return a valid PDF export.")
                        content = output[0][1]
                        page_markers = __import__("re").findall(rb"/Type\s*/Page(?!s)", content)
                        if len(page_markers) != 5:
                            raise HTTPException(502, f"Canva PDF contains {len(page_markers)} pages; expected five.")
                        media_type = "application/pdf"
                        filename = "pawzz-carousel.pdf"
                    else:
                        if len(output) == 1 and output[0][1].startswith(b"PK\x03\x04"):
                            try:
                                with zipfile.ZipFile(io.BytesIO(output[0][1])) as source_archive:
                                    output = [(name, source_archive.read(name)) for name in source_archive.namelist() if name.lower().endswith(".png")]
                            except zipfile.BadZipFile as error:
                                raise HTTPException(502, "Canva returned an invalid PNG archive.") from error
                        if len(output) != 5 or any(not data.startswith(b"\x89PNG\r\n\x1a\n") for _, data in output):
                            raise HTTPException(502, f"Canva returned {len(output)} PNG pages; expected five valid PNG files.")
                        archive = io.BytesIO()
                        with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as bundle:
                            for index, (name, data) in enumerate(output, 1):
                                bundle.writestr(f"slide-{index}.png", data)
                        content = archive.getvalue()
                        media_type = "application/zip"
                        filename = "pawzz-carousel-png.zip"
                    return Response(content, media_type=media_type, headers={"Content-Disposition": f'attachment; filename="{filename}"'})
    except HTTPException:
        raise
    except Exception as error:
        logger.exception("Canva export failed (%s)", file_format)
        detail = "Canva export failed. Reconnect Canva and try again."
        if "invalid_grant" in str(error).lower():
            storage.tokens = None
            detail = "Canva rejected the saved authorization. Reconnect Canva, then retry the export."
        else:
            detail = f"Canva export failed ({_safe_canva_error(error)})."
        raise HTTPException(502, detail) from error
    finally:
        if not http_client.is_closed:
            await http_client.aclose()
