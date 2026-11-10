from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agent.content_agent import generate_carousel_content
from mcp_server.canva_client import router as canva_router

app = FastAPI(
    title="Pawzz AI Content API",
    description="AI-powered social media carousel creation system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(canva_router)


class CarouselRequest(BaseModel):
    topic: str = Field(min_length=3, max_length=500)
    platform: str = Field(default="Instagram", max_length=40)
    audience: str = Field(default="General audience", max_length=120)
    tone: str = Field(default="Educational", max_length=120)
    slide_count: int = Field(default=6, ge=3, le=10)


@app.get("/")
async def root():
    return {"message": "Welcome to Pawzz AI Content API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pawzz-backend", "version": "1.0.0"}


@app.post("/api/generate-carousel")
async def generate_carousel(request: CarouselRequest):
    try:
        result = generate_carousel_content(
            topic=request.topic,
            platform=request.platform,
            audience=request.audience,
            tone=request.tone,
            slide_count=request.slide_count,
        )
        return {"success": True, "message": "Carousel content generated successfully", "data": result}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        print(f"Carousel generation failed: {type(error).__name__}")
        raise HTTPException(status_code=502, detail="AI content generation failed. Please try again.") from error
