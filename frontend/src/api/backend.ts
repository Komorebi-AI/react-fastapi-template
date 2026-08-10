import { api } from './client'
import type { paths } from './schema'

// Typed wrappers for the example backend endpoints. The types are not written
// by hand: they are read out of schema.d.ts, which `make generate-types`
// derives from the backend's OpenAPI schema. Rename or reshape an endpoint in
// backend/app/api.py and these lines stop compiling — that is the point.
//
// Replace these wrappers with your real API as it grows.

type Json<T> = T extends { content: { 'application/json': infer B } } ? B : never
type Ok<P> = P extends { responses: { 200: infer R } } ? Json<R> : never
type Body<P> = P extends { requestBody: infer B } ? Json<B> : never

export type ApiInfo = Ok<paths['/']['get']>
export type Health = Ok<paths['/health']['get']>
export type PredictBody = Body<paths['/predict']['post']>
export type PredictResponse = Ok<paths['/predict']['post']>

/** GET / returns `{"<package>-api": "version <x>"}`. */
export async function getApiInfo(): Promise<string> {
  const info = await api<ApiInfo>('/')
  return Object.values(info)[0] ?? 'unknown'
}

/** GET /health — used by the compose healthcheck and CI. */
export function getHealth(): Promise<Health> {
  return api<Health>('/health')
}

/** POST /predict echoes the input back — a stand-in for a real model. */
export function predict(input: PredictBody['input']): Promise<PredictResponse> {
  const body: PredictBody = { input }
  return api<PredictResponse>('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
