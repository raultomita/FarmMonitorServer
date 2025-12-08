import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
  }

  if (command === 'serve') {
    config.server = {
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          secure: false,
        },
        '/hub': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      }
    }
  }

  return config
})
