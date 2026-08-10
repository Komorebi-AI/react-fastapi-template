// Minimal typed wrapper around fetch for talking to the backend.
//
// By default requests go to `/api`, which the Vite dev server proxies to the
// backend (see vite.config.ts) and which a reverse proxy (e.g. nginx) is
// expected to route in production. Set VITE_API_URL at build time to point
// somewhere else.
const API_BASE_URL: string = import.meta.env.VITE_API_URL || '/api'

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
