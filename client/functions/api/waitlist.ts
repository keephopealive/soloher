// Cloudflare Pages Function: POST /api/waitlist  { email, source?, website?, utm_source?, utm_medium?, utm_campaign?, utm_content? }
// Saves a waitlist email to the D1 database bound as DB (see wrangler.toml) and sends the
// welcome email to new sign-ups (server-lib/welcome-email.ts), plus a notification to the team
// (server-lib/waitlist-notify.ts).
import { sendWelcomeEmail, type WelcomeEnv } from '../../server-lib/welcome-email'
import { sendWaitlistNotification } from '../../server-lib/waitlist-notify'

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<{ meta: { changes: number } }>
  first<T>(): Promise<T | null>
}
interface Env extends WelcomeEnv {
  DB: { prepare(query: string): D1PreparedStatement }
}
interface Context {
  request: Request
  env: Env
  waitUntil(promise: Promise<unknown>): void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export async function onRequestPost({ request, env, waitUntil }: Context): Promise<Response> {
  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400)
  }

  // Honeypot: real visitors never see or fill the "website" field; bots often do
  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return json({ ok: true })
  }

  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400)
  }
  const source = typeof data.source === 'string' ? data.source.slice(0, 40) : null
  // Campaign tags from the link the visitor arrived on, saved as-is (any value, not a fixed list)
  const tag = (v: unknown) => (typeof v === 'string' && v.trim() !== '' ? v.trim().slice(0, 200) : null)
  const utm = [data.utm_source, data.utm_medium, data.utm_campaign, data.utm_content].map(tag)

  let added: boolean
  try {
    // Signing up twice is fine. Joining again after unsubscribing re-subscribes the address.
    // changes = 1 for a new or returning address, 0 if it was already on the list.
    // An address already on the list keeps the tags from when it first signed up.
    const result = await env.DB.prepare(
      'INSERT INTO waitlist (email, source, utm_source, utm_medium, utm_campaign, utm_content) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET unsubscribed_at = NULL WHERE unsubscribed_at IS NOT NULL',
    )
      .bind(email, source, ...utm)
      .run()
    added = result.meta.changes > 0
  } catch {
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500)
  }

  // Welcome email goes out in the background, only once per subscription
  if (added) waitUntil(sendWelcomeEmail(env, email).catch(err => console.error('Welcome email error', err)))

  // Tell the team about each new (or returning) sign-up, with where they came from
  if (added) {
    const [utm_source, utm_medium, utm_campaign, utm_content] = utm
    waitUntil(
      (async () => {
        const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM waitlist WHERE unsubscribed_at IS NULL')
          .first<{ n: number }>()
          .catch(() => null)
        await sendWaitlistNotification(env, {
          email,
          source,
          utm: { utm_source, utm_medium, utm_campaign, utm_content },
          total: count?.n ?? null,
        })
      })().catch(err => console.error('Waitlist notification error', err)),
    )
  }

  return json({ ok: true })
}
