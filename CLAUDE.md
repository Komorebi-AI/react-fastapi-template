# CLAUDE.md

Fullstack template: React frontend (`frontend/`) + FastAPI backend (`backend/`).

## Ownership model — IMPORTANT

- `backend/` is a **rendered mirror** of
  [python-copier-template](https://github.com/Komorebi-AI/python-copier-template).
  Do NOT edit files under `backend/` in this repo: a sync job there re-renders
  the template and replaces the whole directory, wiping local changes. Backend
  changes belong in python-copier-template, which documents the sync (it drops
  the rendered `.github/`, since workflows are repo-owned here, and sets
  `[tool.setuptools_scm] root = ".."` because the pyproject is not at the git
  root). Files marked `TEMPORARY` carry patches for known upstream bugs.
- Note for projects created from this template: the rule above applies to the
  template repo only. Your `backend/` is a plain copy you own — delete this
  section.
- `frontend/` and everything at the repo root are owned by this repo and
  edited normally.

## Commands

- Frontend (`cd frontend`): npm. `npm run dev` (port 5173), `npm test`,
  `npm run lint`, `npm run build`.
- Backend (`cd backend`): uv, never pip. `uv run python app/api.py` (port
  7000), `uv run pytest`, `uv run ruff check .`, `uv run ty check app tests`.
- Full stack: `docker compose up --build` (port 8080). Root `Makefile` has
  delegating targets.

## API contract

The frontend example calls `GET /api/` (version) and `POST /api/predict`;
both proxies (Vite dev, nginx) strip the `/api` prefix before the backend.
If a template sync changes `backend/app/api.py`, update
`frontend/src/api/backend.ts` and its tests to match.
