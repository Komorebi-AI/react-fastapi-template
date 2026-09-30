// Minimal typed wrapper around fetch for talking to the backend.
//
// By default requests go to `api` under the app's own base path — `/api` at
// the domain root, `/myapp/api` when built with VITE_BASE_PATH=/myapp/. The
// Vite dev server proxies that to the backend (see vite.config.ts) and a
// reverse proxy (e.g. nginx) is expected to route it in production. Set
// VITE_API_URL at build time to point somewhere else entirely.
const API_BASE_URL: string = import.meta.env.VITE_API_URL || `${import.meta.env.BASE_URL}api`

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init)
  if (!response.ok) {
    throw new ApiError(response.status, `${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}
