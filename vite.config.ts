import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/open': {
        target: 'https://openapi.akool.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
})
