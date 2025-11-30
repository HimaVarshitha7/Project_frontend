// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Forward /api requests to backend
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false
      },
      // Forward /uploads requests to backend (so <a href="/uploads/..."> works)
      '/uploads': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
