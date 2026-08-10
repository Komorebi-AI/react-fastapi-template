# CLAUDE.md

React frontend (`frontend/`) + FastAPI backend (`backend/`).

## Commands

- Frontend (`cd frontend`): npm. `npm run dev` (5173), `npm test`,
  `npm run lint`, `npm run build`.
- Backend (`cd backend`): uv, never pip. `uv run python app/api.py` (7000),
  `uv run pytest`, `uv run ruff check .`, `uv run ty check app tests`.
- Both: root `Makefile` delegates (`make test`, `make lint`, `make up`).

## Conventions

- The frontend calls `/api/*`; both proxies (Vite dev, nginx) strip the prefix
  before the backend. Keep endpoint wrappers in `frontend/src/api/`, typed and
  matching `backend/app/api.py`.
- Keep `GET /health`: the compose healthcheck and CI depend on it.
