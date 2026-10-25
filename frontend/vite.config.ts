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
    __CONTEXT_PATH__: JSON.stringify(CONTEXT_PATH),
  },
  server: {
    proxy: {
      // Tutto ciò che sta sotto il context path ma fuori da /app (API e pagine JSP) va al backend
      [`^${CONTEXT_PATH}/(?!app(/|$))`]: BACKEND_URL,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
