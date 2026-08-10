# react-fastapi-template

Fullstack template at Komorebi AI: a **React frontend** (`frontend/`) paired with a
**FastAPI backend** (`backend/`). Use it as the starting point for technical tests,
experiments and apps.

Need only one half? Delete `frontend/` or `backend/` — or start from
[python-template](https://github.com/Komorebi-AI/python-template) for a backend-only
project.

## Structure

```
frontend/   React + TypeScript + Vite + MUI + TanStack Query   → frontend/README.md
backend/    FastAPI + uv, ruff, ty, pytest                     → backend/README.md
compose.yaml, Makefile, .github/                                  full-stack glue
```

## Quickstart

Requirements: [Node 24](https://nodejs.org/) (see `frontend/.nvmrc`) and
[uv](https://docs.astral.sh/uv/).

```bash
make install
```

Local development, in two terminals:

```bash
make dev-backend    # FastAPI with reload at http://localhost:7000
make dev-frontend   # Vite with HMR at http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend (stripping the prefix), so no CORS
configuration is needed. The example page shows the backend version and a mock
prediction round-trip.

Full stack in containers:

```bash
make up             # docker compose up --build → http://localhost:8080
```

nginx serves the built frontend and proxies `/api` to the backend container.

## Checks

```bash
make test           # frontend Vitest + backend pytest
make lint           # ESLint/Prettier + ruff/ty
```

CI runs path-filtered workflows: **Frontend** (lint, format, test, build), **Backend**
(ruff, ty, pytest), **Contract** — boots the real backend and exercises the endpoints
the frontend calls, so frontend/backend drift fails visibly — and **Docker** (builds
both images and checks the same contract through nginx).

## API contract

The frontend's typed endpoint wrappers (`frontend/src/api/backend.ts`) match
`backend/app/api.py`:

| Endpoint            | Response                         | Used for                   |
| ------------------- | -------------------------------- | -------------------------- |
| `GET /api/`         | `{"app-api": "version ..."}`     | status/version chip        |
| `POST /api/predict` | `{"input": n}` → `{"output": n}` | mock prediction demo       |
| `GET /api/health`   | `{"status": "ok"}`               | container healthchecks, CI |

Both proxies (Vite in dev, nginx in prod) strip the `/api` prefix before forwarding to
the backend. `/health` is the stable endpoint — keep it when replacing the example
endpoints, since the compose healthcheck and CI smoke tests rely on it.

## Starting a project from this template

1. Use GitHub's **"Use this template"** (or clone and re-init git).
2. Rename things: `frontend/package.json` name, `backend/Makefile` image name,
   `backend/pyproject.toml` name and description.
3. Replace the example page and endpoints with your app. Keep the patterns:
   typed API wrappers, useQuery/useMutation, the `/api` prefix convention, and the
   `/health` endpoint the compose healthcheck and CI rely on.

---

Maintaining this template itself: `backend/` is kept up to date automatically — read
[docs/backend-sync.md](docs/backend-sync.md) before editing anything under it.
