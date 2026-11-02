# Frontend

React frontend of the template. See the repository root README for the full-stack picture.

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [MUI (Material UI)](https://mui.com/) for components and theming (`src/theme.ts`)
- [React Router](https://reactrouter.com/) for client-side routing
- [TanStack Query](https://tanstack.com/query/latest) for server state (fetching, caching, mutations)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for tests
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for linting and formatting

## Getting started

Requires Node 24 LTS (see `.nvmrc`; `nvm use` picks it up). Node ≥ 22 works too.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

### Talking to the backend

API calls go through the small wrapper in `src/api/client.ts` and hit `/api/...`:

- **Development**: the Vite dev server proxies `/api` to the backend at
  `http://localhost:7000`, stripping the `/api` prefix (see `vite.config.ts`) —
  no CORS setup needed.
- **Production**: nginx does the same routing (see `docker/nginx.conf` and the
  compose variant `docker/nginx.compose.conf`), or set `VITE_API_URL` at build
  time (see `.env.example`).

### Deploying under a sub-path

The app is served from the domain root by default. To put it behind a path
prefix, build with `VITE_BASE_PATH` — one variable moves the asset URLs, the
router's `basename` and the default API base together:

```bash
VITE_BASE_PATH=/myapp/ npm run build
# or: docker build --build-arg VITE_BASE_PATH=/myapp/ .
```

The build then loads `/myapp/assets/...` and calls `/myapp/api/...`, so the
proxy in front of it needs to serve the files and route that API prefix under
`/myapp/`.

The example endpoints live in `src/api/backend.ts` and match `backend/app/api.py`:

- `GET /api/` → `{"app-api": "version ..."}` (status/version chip)
- `POST /api/predict` `{"input": n}` → `{"output": n}` (mock prediction demo)

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

Multi-stage `Dockerfile`: Node 24 builds the app, an unprivileged nginx serves
it (non-root, port 8080, SPA fallback, immutable caching for hashed assets).
Usually built via the root `compose.yaml`, but it works standalone:

```bash
docker build -t my-app-frontend .
docker run --rm -p 8080:8080 my-app-frontend
```

## Project structure

```
src/
├── api/          # Backend client (fetch wrapper + typed endpoint functions)
├── components/   # Reusable components (layout...)
├── pages/        # One component per route, registered in App.tsx
├── App.tsx       # Providers (theme, query client) and routes
├── theme.ts      # MUI theme customization
└── main.tsx      # Entry point
```

## Notes

- `.npmrc` hardens installs against npm supply-chain attacks
  (`min-release-age` cooldown + `ignore-scripts`), mirroring the uv
  `exclude-newer` setting on the backend.
- Environment variables must be prefixed with `VITE_` to be visible to client
  code, and they are baked in at build time — never put secrets in them.
