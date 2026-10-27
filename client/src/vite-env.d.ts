/// <reference types="vite/client" />

interface Window {
  /** Google Analytics, present only when the build added the tag (see vite.config.ts) */
  gtag?: (...args: unknown[]) => void
}
