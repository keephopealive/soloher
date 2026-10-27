// Which version of the site this build is. Set VITE_SALES_MODE in the .env file for each build:
// "waitlist" (before launch: every call to action joins the waitlist) or "sell" (default: subscribe / gift buttons).
export const WAITLIST_MODE = import.meta.env.VITE_SALES_MODE === 'waitlist'

// Where /api requests go. Empty = same site (Cloudflare, local dev); the GitHub Pages build sets
// VITE_API_BASE to the Cloudflare site because GitHub Pages can't run the server functions.
export const API_BASE = import.meta.env.VITE_API_BASE ?? ''
