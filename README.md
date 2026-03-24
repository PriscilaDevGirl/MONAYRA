# Monayra

Monayra is an inclusive employability platform designed for women, trans women, and travestis. The product removes visual bias from hiring by replacing profile photos with symbolic avatars and by withholding sensitive candidate data until the hiring process reaches an approved stage.

## Product pillars

- Anonymous-first candidate discovery
- Humanized resumes focused on trajectory, skills, and growth
- Inclusive matching that values potential over traditional pedigree
- Ethical hiring workflow with sensitive-data release only after hiring confirmation
- Auditable AI support with bias-mitigation rules

## Repository structure

- `backend/`: FastAPI application, domain models, schemas, and APIs
- `frontend/`: React interface for candidates and companies
- `docs/`: product, privacy, and architecture documentation

## Core journeys

### Candidates

Candidates can create a secure profile using:

- social name
- self-declared gender
- partial anonymity preferences
- symbolic avatar settings
- humanized resume fields

Sensitive fields such as legal name, personal contacts, and formal documents are stored separately and are not exposed to hiring companies during the screening phase.

### Companies

Companies submit job openings and receive ranked shortlists based on:

- real skills
- behavioral indicators
- growth potential
- return-to-market signals

The platform flags biased requirements and encourages inclusive behavior through alerts and transparency rules.

## Privacy model

The system separates:

- `public_profile`: safe screening information
- `sensitive_profile`: protected information

Protected information is only released after the vacancy reaches a confirmed hiring state and the candidate authorizes disclosure.

## Local development

### Backend

1. Create a virtual environment.
2. Install dependencies from `backend/requirements.txt`.
3. Copy `backend/.env.example` to `backend/.env`.
4. Run `uvicorn app.main:app --reload` inside `backend/`.

### Frontend

The frontend is a React/Vite structure prepared for local setup.

1. Install Node.js 20+.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Run `npm install` inside `frontend/`.
4. Run `npm run dev`.
5. Open `http://localhost:5173`.

### PostgreSQL

For a local PostgreSQL instance:

1. Run `docker compose up -d postgres`.
2. Set `DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/monayra`.
3. Restart the API.

## Frontend deploy

The frontend is ready for static deployment with:

- `vercel.json` at the repository root for monorepo-style Vercel imports
- `frontend/vercel.json`
- `frontend/netlify.toml`

The backend deployment guide is available in `docs/deploy-backend.md`.

Quick guide:

1. If you connected the whole repository on Vercel, you can either keep the Root Directory at the repository root using `vercel.json`, or set the Root Directory to `frontend`.
2. Set `VITE_API_BASE_URL` to your public backend URL.
3. Make sure the backend CORS configuration allows your Vercel domain.
4. Use the generated public link to review the interface in the browser.

## Recommended next steps

1. Add Alembic migrations and seed data.
2. Implement file upload for audio and video trajectories.
3. Add audit logs for every AI recommendation and sensitive-data unlock event.
4. Build candidate application flow and recruiter shortlist actions in the UI.
5. Deploy backend and frontend to AWS.
