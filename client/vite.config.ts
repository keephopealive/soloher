import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Adds the Google Analytics tag to built pages when VITE_GA_ID is set (only .env.cloudflare sets it).
// Build-only, so local dev visits are never counted.
function googleAnalytics(id: string | undefined): Plugin {
  return {
    name: 'google-analytics',
    apply: 'build',
    transformIndexHtml() {
      if (!id) return []
      return [
        { tag: 'script', attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${id}` }, injectTo: 'head-prepend' },
        {
          tag: 'script',
          children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`,
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// GitHub Pages serves the site under /soloher/; Cloudflare Pages serves it at the root.
// `vite build --mode cloudflare` picks the Cloudflare settings (see .env.cloudflare).
export default defineConfig(({ mode }) => ({
  plugins: [react(), googleAnalytics(loadEnv(mode, process.cwd()).VITE_GA_ID)],
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
