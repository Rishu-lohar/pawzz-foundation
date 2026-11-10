# Pawzz Foundation – Internship Assignment

Pawzz is a prototype covering the three deliverables of the internship assignment.

## Project Modules

### Task 1 – Animal Care Discovery (`/animals`)
A discovery interface for animal-care services, including clinics, hospitals, boarding, diagnostics, ambulances, and NGOs.

Features include:
- Search and service/location filters.
- Provider cards and details.
- Ratings and availability indicators.
- Provider contact/action interface.

**Note:** Provider listings are illustrative prototype data and are not verified live business listings.

### Task 2 – AI Education (`/education`)
An educational landing page presenting AI and digital-skills programmes.

Features include:
- Programme information.
- Learning value proposition.
- FAQs.
- Enquiry/registration form with frontend confirmation.

**Note:** Programme information is illustrative. The enquiry form is a frontend demonstration and does not store or transmit submissions.

### Task 3 – AI Content Creation System (`/content-system`)
An AI-assisted carousel content creation workflow using Groq and Canva MCP.

Features include:
- Generate structured carousel content using Groq.
- Generate headlines, slide copy, visual directions, captions, and CTAs.
- Review and edit generated slide content.
- Create an editable Canva design.
- Open and edit the design in Canva.
- Export carousel designs as PNG and PDF.

The Canva workflow uses the existing authenticated Canva connection. Canva authorization may need to be completed again after restarting the backend.

## Technology Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend**
- Python
- FastAPI

**Integrations**
- Groq API for AI content generation.
- Canva MCP for editable designs and exports.

## Requirements

Install the following before running the project:

- Node.js and npm
- Python 3.11 or later
- Groq API key
- Canva Developer app with Canva MCP enabled

## Setup and Configuration

### 1. Install frontend dependencies

From the project root:

```powershell
npm install
```

### 2. Configure backend environment variables

Create a file named `backend/.env`:

```dotenv
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b

CANVA_CLIENT_ID=your_canva_client_id
CANVA_CLIENT_SECRET=your_canva_client_secret
CANVA_REDIRECT_URI=http://127.0.0.1:8000/auth/canva/callback
CANVA_MCP_URL=https://api.canva.com/connect/v1/mcp
```

Replace the placeholder values with your own credentials.

In the Canva Developer Portal:

1. Create or open your Canva app.
2. Enable Canva MCP.
3. Add the following redirect URL under **Outside Canva → Redirect URLs**:

`http://127.0.0.1:8000/auth/canva/callback`

4. Save the configuration.

**Security:** Never commit API keys, client secrets, access tokens, or `.env` files to GitHub.

### 3. Start the FastAPI backend

Open a terminal:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend will run at:

`http://127.0.0.1:8000`

### 4. Start the Next.js frontend

Open a second terminal in the project root:

```powershell
npm run dev
```

Open the application:

`http://localhost:3000`

The frontend connects to the local backend at `http://127.0.0.1:8000` by default.

If the backend uses another address, configure `NEXT_PUBLIC_API_BASE_URL` in the root `.env.local` file.

## Task 3 – How to Use

1. Open `/content-system`.
2. Enter a project name and raw content idea.
3. Select the platform, target audience, content tone, and slide count.
4. Click **Generate carousel with AI**.
5. Review and edit the generated carousel content.
6. Select **Create editable Canva design**.
7. Complete Canva authorization if prompted.
8. Open the generated Canva design and make any required edits.
9. Return to Pawzz and use the PNG or PDF export controls.
10. Verify the downloaded files.

PNG export provides a ZIP containing individual slide images. PDF export provides a multi-page PDF.

The Canva integration uses Canva's actual export files rather than simulated or placeholder exports.

## Validation

The following checks were completed:

| Validation | Result |
|---|---|
| `/animals` route | Passed |
| `/education` route | Passed |
| `/content-system` route | Passed |
| Groq carousel generation | Passed |
| Five-page Canva design creation | Passed |
| Canva editor access | Passed |
| Canva slide edit persistence after reload | Passed |
| PNG export – five slide images | Passed |
| PDF export – five-page document | Passed |
| Production frontend build | Passed |
| Frontend lint | Passed |

Commands used for frontend validation:

```powershell
npm run build -- --webpack
npm run lint
```

**Export verification note:** The actual PNG archive contents and PDF signature/page objects were validated before the frontend received the downloads. The downloaded files could not be opened separately in a native viewer during the verification session.

## Backend API Endpoints

- Health check: `GET /health`
- Groq carousel generation: `POST /api/generate-carousel`
- Reconnect an existing Canva design: `POST /api/canva/adopt-design`
- Canva export: `POST /api/canva/jobs/{job_id}/export?file_format=png`
- Canva PDF export: `POST /api/canva/jobs/{job_id}/export?file_format=pdf`

## Project Notes

- This is an internship assignment prototype, not a production deployment.
- Animal-care listings and educational programme details are illustrative.
- The education enquiry form does not persist submissions.
- Canva requires an authorized account and an active backend session.
- Canva authentication may need to be repeated after a backend restart.
- See `ASSIGNMENT_CHECKLIST.md` for the implementation checklist and known limitations.

---

**Pawzz Foundation – Internship Assignment Prototype**