# Resume Tailor Frontend

A React client for the existing FastAPI resume matcher. It uses the backend's real cookie-authenticated endpoints for PDF analysis, factual resume tailoring, secure PDF download, and the legacy plain-text matcher.

## Stack

- React, Vite, and TypeScript
- React Router and TanStack Query
- React Hook Form with Zod
- Tailwind CSS with shadcn/ui-style local components
- Lucide icons and Anime.js v4 scoped animations

## Local setup

### Backend

1. Start Ollama and pull the configured model (the backend default is `qwen2.5:1.5b`).
2. From `../resume_matcher.Apis/resume_api`, activate the Python environment and run:

   ```powershell
   uvicorn app.main:app --reload
   ```

The backend README assumes its Python dependencies are already installed. Its supported configuration includes `SECRET_KEY`, `OLLAMA_MODEL`, `OLLAMA_TIMEOUT_SECONDS`, `ANALYSIS_TIMEOUT_SECONDS`, `OLLAMA_REQUIREMENTS_MAX_TOKENS`, and `OLLAMA_TAILOR_MAX_TOKENS`.

### Frontend

1. Copy `.env.example` to `.env` if the backend is not at `http://127.0.0.1:8000`.
2. Install and run:

   ```powershell
   npm install
   npm run dev
   ```

`VITE_DEV_API_TARGET` controls the Vite development proxy target. `VITE_API_BASE_URL` can point at a deployed API, but must never contain secrets. Leaving `VITE_API_BASE_URL` blank uses same-origin requests in production.

## Screens and endpoints

| Screen | Connected endpoints |
| --- | --- |
| Login | `POST /login` |
| Session guard and refresh | `GET /protected`, `POST /refresh` |
| PDF analysis | `POST /api/analyze-resume` |
| Analysis results and PDF export | `GET /api/download-resume/{file_id}` |
| Legacy text matcher | `POST /api/match` |
| Logout | `POST /logout` |

All requests include cookies. The analyzer accepts a text-based PDF up to 10 MB, a job description, and an optional tailoring flag. Results show required/preferred coverage, exact job-description evidence, resume evidence, warnings, changes, suggestions, tailored text, and a PDF download when available.

## Backend gaps and deployment notes

- The backend has no CORS middleware. Development works through the included Vite proxy; production should serve both apps on one origin or use a same-origin reverse proxy. A separate frontend origin requires an explicit credentialed CORS and cookie policy change in the backend.
- Authentication uses a hard-coded backend-only mock user. There is no registration, password reset, structured current-user endpoint, roles, or role-based authorization.
- There are no history, persistence, search, filtering, or pagination endpoints.
- Download ownership is process memory only; it is lost after a backend restart and does not work reliably across multiple workers.
- Generated PDFs are not automatically removed despite the API's expiry-oriented error wording.
- Scanned/image-only or encrypted PDFs are not supported. The backend requires selectable text.
- The legacy matcher can turn intended validation errors into status 500 because of broad exception handling.

## Checks

```powershell
npm run typecheck
npm run lint
npm run build
```
