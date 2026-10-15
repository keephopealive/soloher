// Cloudflare Pages Function: POST /api/waitlist  { email, source?, website? }
// Saves a pre-sale waitlist email to the D1 database bound as DB (see wrangler.toml).

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<{ meta: { changes: number } }>
}
interface Env {
  DB: { prepare(query: string): D1PreparedStatement }
}
interface Context {
  request: Request
  env: Env
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  let data: { email?: unknown; source?: unknown; website?: unknown }
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

  try {
    // Signing up twice is fine. Joining again after unsubscribing re-subscribes the address.
    await env.DB.prepare(
      'INSERT INTO waitlist (email, source) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET unsubscribed_at = NULL',
    )
      .bind(email, source)
      .run()
  } catch {
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500)
  }

  return json({ ok: true })
}
