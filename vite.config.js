import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const api = 'http://127.0.0.1:3001'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: api, changeOrigin: false },
    },
  },
  preview: {
    proxy: {
      '/api': { target: api, changeOrigin: false },
    },
  },
})
