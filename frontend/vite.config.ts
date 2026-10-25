/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Context path della webapp (Rubrica.war -> /Rubrica). La SPA vive sotto /Rubrica/app/.
const CONTEXT_PATH = '/Rubrica'
const BACKEND_URL = 'http://localhost:8080'

export default defineConfig({
  base: `${CONTEXT_PATH}/app/`,
  plugins: [react(), tailwindcss()],
  define: {
    __API_URL__: JSON.stringify(`${CONTEXT_PATH}/api`),
  },
  server: {
    proxy: {
      [`${CONTEXT_PATH}/api`]: BACKEND_URL,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
