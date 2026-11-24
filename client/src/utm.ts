// Campaign tags (utm_source etc.) from the link a visitor arrived on, saved with waitlist sign-ups
// so we can see which post brought each person in. Kept in sessionStorage so they survive
// moving around the site before signing up. Values are kept exactly as they arrive.
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>

const STORAGE_KEY = 'soloher-utm'

/** Call once on page load: remembers the tags if the URL has any. */
export function captureUtm() {
  const params = new URLSearchParams(window.location.search)
  const found: Utm = {}
  for (const k of UTM_KEYS) {
    const v = params.get(k)
    if (v) found[k] = v
  }
  // A new tagged link replaces the old set entirely, so tags from two posts never mix
  if (Object.keys(found).length === 0) return
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found)) } catch { /* storage blocked */ }
}

/** The tags remembered for this visit (empty if they arrived without any). */
export function getUtm(): Utm {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Utm) : {}
  } catch {
    return {}
  }
}
