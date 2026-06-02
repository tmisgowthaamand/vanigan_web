import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3001,
    // Mirror the Vercel /proxy-api rewrite during local dev so the same
    // same-origin API path works in development without CORS issues.
    proxy: {
      '/proxy-api': {
        target: 'https://vanigan-app-automation-5il0.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/proxy-api/, ''),
      },
    },
  },
})
