# react-template

Template for React frontends at Komorebi AI, typically paired with a Python backend
(FastAPI/Flask). Use it as the starting point for technical tests, experiments and app frontends.

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [MUI (Material UI)](https://mui.com/) for components and theming (`src/theme.ts`)
- [React Router](https://reactrouter.com/) for client-side routing
- [TanStack Query](https://tanstack.com/query/latest) for server state (fetching, caching, mutations)
- [react-dropzone](https://react-dropzone.js.org/) file-upload example wired to the backend
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for tests
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for linting and formatting
- GitHub Actions CI (lint, format check, test, build on every PR)

## Getting started

Requires Node 24 LTS (see `.nvmrc`; `nvm use` picks it up). Node ≥ 22 works too.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

### Talking to the backend

API calls go through the small wrapper in `src/api/client.ts` and hit `/api/...`:

- **Development**: the Vite dev server proxies `/api` to `http://localhost:8000`
  (see `vite.config.ts`) — no CORS setup needed. Adjust the target if your backend
  runs elsewhere.
- **Production**: serve the built frontend behind a reverse proxy that routes `/api`
  to the backend, or set `VITE_API_URL` at build time (see `.env.example`).

The home page expects two example endpoints — replace them with your real API:

- `GET /api/health` → `{"status": "ok"}` (backend status chip)
- `POST /api/upload` (multipart form data, field `files`) → `{"message": "..."}`

## Scripts

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start the dev server with HMR       |
| `npm run build`        | Type-check and build for production |
| `npm run preview`      | Serve the production build locally  |
| `npm test`             | Run tests once                      |
| `npm run test:watch`   | Run tests in watch mode             |
| `npm run lint`         | Lint with ESLint                    |
| `npm run format`       | Format with Prettier                |
| `npm run format:check` | Check formatting (used in CI)       |

## Docker

A multi-stage `Dockerfile` is included: Node 24 builds the app, and an
unprivileged nginx serves the static output (non-root, port 8080, SPA fallback,
immutable caching for hashed assets). Node is not part of the final image.

```bash
docker build -t my-app .
docker run --rm -p 8080:8080 my-app
```

`VITE_API_URL` can be set at build time (`--build-arg VITE_API_URL=...`); by
default the app calls `/api`, and `docker/nginx.conf` contains a commented
`location /api/` block to proxy those calls to your backend container.

## Project structure

```
src/
├── api/          # Backend client (fetch wrapper, API types)
├── components/   # Reusable components (layout, dropzone...)
├── pages/        # One component per route, registered in App.tsx
├── App.tsx       # Providers (theme, query client) and routes
├── theme.ts      # MUI theme customization
└── main.tsx      # Entry point
```

## Notes

- `.npmrc` hardens installs against npm supply-chain attacks
  (`min-release-age` cooldown + `ignore-scripts`). Keep it in projects created
  from this template.
- Environment variables must be prefixed with `VITE_` to be visible to client
  code, and they are baked in at build time — never put secrets in them.
