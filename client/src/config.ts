// Which version of the site this build is. Set VITE_SALES_MODE in the .env file for each build:
// "waitlist" (before launch: every call to action joins the waitlist) or "sell" (default: subscribe / gift buttons).
export const WAITLIST_MODE = import.meta.env.VITE_SALES_MODE === 'waitlist'
