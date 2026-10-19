# Resume Tailor Frontend (`resume_matcher.App`)

A modern, responsive React web application for analyzing, matching, and tailoring resumes against job descriptions using an AI-powered backend.

---

## Overview

The Frontend client interfaces with the FastAPI backend to deliver:
- **Cookie-Authenticated Sessions**: HttpOnly JWT session guard with automatic refresh.
- **Advanced PDF Resume Analysis**: Drag-and-drop text-based PDF upload and structured job description matching.
- **Factual Resume Tailoring**: Interactive diff view comparing the original resume against an AI-tailored version highlighting matching requirements.
- **Direct PDF Export**: Immediate download of the newly generated tailored PDF document.
- **Legacy Text Matcher**: Direct plain-text comparison for quick skill overlap checks.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Data Fetching & State**: [@tanstack/react-query](https://tanstack.com/query)
- **Routing**: [React Router](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with shadcn/ui-inspired component architecture
- **Icons & Motion**: [Lucide React](https://lucide.dev/) + [Anime.js v4](https://animejs.com/) scoped micro-animations

---

## Project Structure

```text
resume_matcher.App/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable presentation & UI components
│   │   └── ui/             # Buttons, inputs, cards, switches, badges
│   ├── features/           # Domain/feature modules
│   │   ├── analysis/       # PDF upload, analysis results, diff, and export
│   │   ├── auth/           # Login form, protected route guard, session logic
│   │   └── legacy/         # Plain-text quick matcher interface
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API client, TanStack Query configuration, helpers
│   ├── types/              # TypeScript interface definitions
│   ├── app.tsx             # Route definitions and app providers
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global Tailwind and font styles
├── .env.example            # Sample environment variables
├── package.json            # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration with backend proxy
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- Running instance of the backend API (see [resume_matcher.Apis](../resume_matcher.Apis/README.md))

### 1. Installation

From the `resume_matcher.App` directory:

```powershell
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```powershell
cp .env.example .env
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_DEV_API_TARGET` | `http://127.0.0.1:8000` | Target URL used by the Vite dev proxy for API requests |
| `VITE_API_BASE_URL` | *(empty)* | Base URL for deployed API in production. Leave empty to use same-origin requests |

> [!NOTE]
> During development, Vite proxies all `/api`, `/login`, `/logout`, `/refresh`, and `/protected` requests to `VITE_DEV_API_TARGET`. This allows cookies to pass seamlessly without local cross-origin issues.

### 3. Run the Development Server

```powershell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Application Screens & Workflows

| Screen / Feature | Route | Connected Endpoints | Description |
| --- | --- | --- | --- |
| **Login** | `/login` | `POST /login` | Authenticate using backend credentials. Stores HttpOnly JWT cookies. |
| **Protected Guard** | *(all private routes)* | `GET /protected`, `POST /refresh` | Verifies user session and automatically refreshes expiring access tokens. |
| **PDF Resume Analyzer** | `/` | `POST /api/analyze-resume` | Upload a text PDF (<=10 MB), paste Job Description, and toggle tailoring. |
| **Analysis Results & Diff** | `/` (result state) | `GET /api/download-resume/{file_id}` | View required/preferred match stats, evidence quotes, and download tailored PDF. |
| **Legacy Text Matcher** | `/legacy` | `POST /api/match` | Fallback plain-text matcher comparing resume text against JD skills. |
| **Logout** | Header action | `POST /logout` | Clears authentication cookies and redirects to login. |

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Launches the Vite development server with hot module replacement (HMR) |
| `npm run build` | Type-checks with `tsc` and bundles the production app into `dist/` |
| `npm run preview` | Locally serves the production build created in `dist/` |
| `npm run typecheck` | Runs TypeScript compiler checks without emitting files |
| `npm run lint` | Runs ESLint across all TypeScript and React source files |

---

## Production Deployment Notes

1. **Same-Origin Architecture (Recommended)**:
   - In production, host the built frontend assets (`dist/`) behind a reverse proxy (e.g., Nginx, Caddy, or Cloudflare) on the same domain as the FastAPI backend.
   - This ensures HttpOnly authentication cookies (`access_token`, `refresh_token`) work without third-party cookie restrictions.

2. **Separate Origin Architecture**:
   - If deploying the frontend to a distinct domain (e.g., frontend on Vercel and backend on AWS), ensure the backend enables CORS with `allow_credentials=True` and specifies the exact frontend origin, and set cookie `SameSite=None` with `Secure=True`.
