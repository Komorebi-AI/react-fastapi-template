import { api } from './client'

// Typed wrappers for the example backend endpoints (see backend/app/api.py).
// Replace these with your real API as it grows.

/** GET / returns `{"<package>-api": "version <x>"}`. */
export async function getApiInfo(): Promise<string> {
  const info = await api<Record<string, string>>('/')
  return Object.values(info)[0] ?? 'unknown'
}

export interface PredictResponse {
  output: number
}

/** POST /predict echoes the input back — a stand-in for a real model. */
export function predict(input: number): Promise<PredictResponse> {
  return api<PredictResponse>('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  })
}
