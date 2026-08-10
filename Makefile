.PHONY: install dev-frontend dev-backend test lint build up down

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

build:
	npm --prefix frontend run build

# Full stack in containers
up:
	docker compose up --build

down:
	docker compose down
