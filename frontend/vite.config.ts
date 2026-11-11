import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Nest backend (src/main.ts listens on 4000)
      '/auth': 'http://localhost:4000',
    },
  },
})
