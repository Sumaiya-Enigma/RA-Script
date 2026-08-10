# RA Script — Pharmaceutical AI Regulatory Affairs Assistant & CMC Specialist

Production-grade architecture for AI Regulatory Affairs & CMC Submission Management.

## Architecture Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS (Port `3100`)
- **Backend**: FastAPI + Python 3.11 + Pydantic v2 + SQLAlchemy Async + Google GenAI SDK (Port `8100`)
- **Database**: PostgreSQL 16 (Port `5432`)
- **Containerization**: Docker & Docker Compose (Local Dev & Production multi-stage)

## Project Structure
```
├── .skills/                 # Preserved engineering skills documentation
├── frontend/                # Next.js frontend application
├── backend/                 # FastAPI backend service
├── docker-compose.yml       # Local development Docker environment
├── docker-compose.prod.yml  # Production deployment Docker environment
├── .env.example             # Environment configuration example
└── README.md
```

## Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env` and set your `GEMINI_API_KEY`:
```bash
cp .env.example .env
```

### 2. Run with Docker Compose (Recommended)
Launch the application (Frontend, Backend, and PostgreSQL):
```bash
docker compose up --build
```

Access the services:
- **Frontend**: http://localhost:3100
- **Backend API Docs**: http://localhost:8100/api/v1/openapi.json
- **Backend Health**: http://localhost:8100/api/v1/health

### 3. Local Development (Without Docker)

#### Backend Setup:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8100 --reload
```

#### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

## Features
- **8 Submission Workspace Modules**: Product Intake, Dossier Workspace, Document Manager (OCR & AI Extraction), AI Regulatory Writer, Cross-Document Consistency Engine, Deterministic Rule Engine, GxP Audit Trail, and eCTD Publisher.
- **Dark / Light Theme Toggle**: Dynamic theme switcher in header.
- **Bangla / English Language Switcher**: Full UI translation between English and Bangla.
- **21 CFR Part 11 Compliance**: GxP audit logs & electronic signature sign-off.
