// Cloudflare Pages Function: POST /api/contact  { name, email, topic?, message, website? }
// Saves a Contact section message to the D1 table contact_messages (see db/contact-schema.sql)
// and emails it to support@soloherbox.com (server-lib/contact-email.ts).
import { sendContactEmail } from '../../server-lib/contact-email'
import type { ResendEnv } from '../../server-lib/resend'

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<unknown>
}
interface Env extends ResendEnv {
  DB: { prepare(query: string): D1PreparedStatement }
}
interface Context {
  request: Request
  env: Env
  waitUntil(promise: Promise<unknown>): void
}

// The GitHub Pages test site posts here from another origin, so it needs CORS headers
const ALLOWED_ORIGINS = ['https://keephopealive.github.io']

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') ?? ''
  if (!ALLOWED_ORIGINS.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export function onRequestOptions({ request }: Context): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) })
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TOPICS = ['General question', 'My order', 'My account', 'Press or partnerships']

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  })
}

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function onRequestPost({ request, env, waitUntil }: Context): Promise<Response> {
  const cors = corsHeaders(request)
  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400, cors)
  }

  // Honeypot: hidden from people, often filled in by bots
  if (text(data.website, 200)) return json({ ok: true }, 200, cors)

  const name = text(data.name, 100)
  const email = text(data.email, 254).toLowerCase()
  const topic = TOPICS.includes(text(data.topic, 60)) ? text(data.topic, 60) : 'General question'
  const message = text(data.message, 4000)

  if (!name) return json({ ok: false, error: 'Please add your name.' }, 400, cors)
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400, cors)
  if (message.length < 2) return json({ ok: false, error: 'Please write a message.' }, 400, cors)

  try {
    await env.DB.prepare('INSERT INTO contact_messages (name, email, topic, message) VALUES (?, ?, ?, ?)')
      .bind(name, email, topic, message)
      .run()
  } catch {
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500, cors)
  }
  // Notification goes out in the background; the message is already saved either way
  waitUntil(sendContactEmail(env, { name, email, topic, message }).catch(err => console.error('Contact email error', err)))
  return json({ ok: true }, 200, cors)
}
