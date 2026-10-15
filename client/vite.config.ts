import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site under /soloher/; Cloudflare Pages serves it at the root.
// `vite build --mode cloudflare` picks the Cloudflare settings (see .env.cloudflare).
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'cloudflare' ? '/' : '/soloher/',
  server: {
    port: 3000,
    // Polling catches rapid successive saves that the native Windows watcher can miss
    watch: { usePolling: true, interval: 200 },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
}))
