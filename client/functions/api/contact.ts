// Cloudflare Pages Function: POST /api/contact  { name, email, topic?, message, website? }
// Saves a Contact section message to the D1 table contact_messages (see db/contact-schema.sql).

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<unknown>
}
interface Env {
  DB: { prepare(query: string): D1PreparedStatement }
}
interface Context {
  request: Request
  env: Env
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TOPICS = ['General question', 'My order', 'My account', 'Press or partnerships']

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400)
  }

  // Honeypot: hidden from people, often filled in by bots
  if (text(data.website, 200)) return json({ ok: true })

  const name = text(data.name, 100)
  const email = text(data.email, 254).toLowerCase()
  const topic = TOPICS.includes(text(data.topic, 60)) ? text(data.topic, 60) : 'General question'
  const message = text(data.message, 4000)

  if (!name) return json({ ok: false, error: 'Please add your name.' }, 400)
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400)
  if (message.length < 2) return json({ ok: false, error: 'Please write a message.' }, 400)

  try {
    await env.DB.prepare('INSERT INTO contact_messages (name, email, topic, message) VALUES (?, ?, ?, ?)')
      .bind(name, email, topic, message)
      .run()
  } catch {
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500)
  }
  return json({ ok: true })
}
