.PHONY: install dev-frontend dev-backend test lint generate-types build up down

# Convenience targets delegating to the two projects. See frontend/README.md
# and backend/README.md for the full command reference of each side.

install:
	npm --prefix frontend install
	cd backend && uv sync

# Run these in two terminals for local development
dev-frontend:
	npm --prefix frontend run dev

dev-backend:
	cd backend && uv run python app/api.py

test:
	npm --prefix frontend test
	cd backend && uv run pytest

lint:
	npm --prefix frontend run lint
	npm --prefix frontend run format:check
	cd backend && uv run ruff check . && uv run ruff format --check . && uv run ty check app tests

# Regenerate the frontend's API types from the backend's OpenAPI schema.
# Run this after changing backend/app/api.py; CI fails if the committed types
# are stale (see .github/workflows/contract.yml).
generate-types:
	cd backend && uv run python -c "import json; from app.api import app; print(json.dumps(app.openapi()))" > ../frontend/openapi.json
	npm --prefix frontend run generate-types

build:
	npm --prefix frontend run build

# Full stack in containers
up:
	docker compose up --build

down:
	docker compose down
