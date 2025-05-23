import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Yahoo Finance API calls to avoid CORS issues in development
      '/v8/finance/chart': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/v8\/finance\/chart/, '/v8/finance/chart'),
      },
    },
  },
})
