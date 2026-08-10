/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API requests to the backend during development so the frontend
    // can call `/api/...` without CORS configuration. The backend serves its
    // routes without the /api prefix, so it is stripped here (nginx does the
    // same in production, see docker/nginx.conf). 7000 matches the dev port
    // used by backend/app/api.py.
    proxy: {
      '/api': {
        target: 'http://localhost:7000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
