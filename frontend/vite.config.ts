/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Read .env files here too, so VITE_BASE_PATH can be set the same ways as
  // VITE_API_URL: an .env file, the shell, or a Docker build arg.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // Vite normalises `base` to a trailing slash; do the same so the dev proxy
  // and the API client agree on where `api` sits.
  const raw = env.VITE_BASE_PATH || '/'
  const base = raw.endsWith('/') ? raw : `${raw}/`

  return {
    // Public path the app is served from. Leave unset for the domain root;
    // set VITE_BASE_PATH=/myapp/ to deploy under a sub-path. Vite exposes the
    // final value as import.meta.env.BASE_URL, which the router and the API
    // client read, so one variable moves the whole app.
    base,
    plugins: [react()],
    server: {
      // Forward API requests to the backend during development so the frontend
      // can call `<base>api/...` without CORS configuration. The backend serves
      // its routes without the prefix, so it is stripped here (nginx does the
      // same in production, see docker/nginx.conf). 7000 matches the dev port
      // used by backend/app/api.py.
      proxy: {
        [`${base}api`]: {
          target: 'http://localhost:7000',
          changeOrigin: true,
          rewrite: (path) => path.slice(`${base}api`.length),
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  }
})
