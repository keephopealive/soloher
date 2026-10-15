// Cloudflare Pages Function: /api/unsubscribe?e=<email>&t=<token>
//  GET  -> confirmation page with a button (email scanners that "click" links won't unsubscribe anyone)
//  POST -> marks the address unsubscribed. Also handles one-click unsubscribe from Gmail / Apple Mail
//          (List-Unsubscribe-Post: List-Unsubscribe=One-Click, RFC 8058).
import { normalizeEmail, verifyUnsubscribeToken } from '../../server-lib/unsubscribe-token'

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<unknown>
}
interface Env {
  DB: { prepare(query: string): D1PreparedStatement }
  UNSUBSCRIBE_SECRET?: string
}
interface Context {
  request: Request
  env: Env
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} | SoloHer</title>
<link rel="icon" type="image/png" href="/favicon.png">
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box;
    background:linear-gradient(150deg,#FAF5F8 0%,#F0DCEA 55%,#FAF5F8 100%);
    font-family:'DM Sans',system-ui,-apple-system,sans-serif;color:#2A1020}
  .card{max-width:440px;width:100%;background:#fff;border:1px solid rgba(196,90,122,.25);border-radius:4px;
    padding:44px 36px;text-align:center}
  .label{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#9B7B45;margin:0 0 12px}
  h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:32px;line-height:1.15;margin:0 0 14px}
  p{font-size:15px;line-height:1.65;color:rgba(42,16,32,.65);margin:0 0 22px}
  strong{color:#2A1020}
  button,.btn{display:inline-block;border:0;cursor:pointer;padding:15px 30px;font:600 12px/1 'DM Sans',sans-serif;
    letter-spacing:.12em;text-transform:uppercase;color:#0D0D0D;text-decoration:none;border-radius:2px;
    background:linear-gradient(90deg,#9B7B45 0%,#C9A96E 28%,#F0D9A8 50%,#C9A96E 72%,#9B7B45 100%)}
  a.quiet{display:block;margin-top:18px;font-size:13px;color:rgba(42,16,32,.55)}
</style></head>
<body><main class="card"><p class="label">SoloHer</p>${body}</main></body></html>`
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  })
}

const invalidLink = () =>
  page('Link not valid', `<h1>This link isn't valid</h1>
<p>The unsubscribe link may be incomplete. Try opening it again from the email, or reply to any SoloHer email and we'll remove you.</p>
<a class="btn" href="/">Visit SoloHer</a>`, 400)

async function readParams(request: Request): Promise<{ email: string; token: string }> {
  const url = new URL(request.url)
  let email = url.searchParams.get('e') ?? ''
  let token = url.searchParams.get('t') ?? ''
  if (request.method === 'POST' && (!email || !token)) {
    const form = await request.formData().catch(() => null)
    email = email || String(form?.get('e') ?? '')
    token = token || String(form?.get('t') ?? '')
  }
  return { email: normalizeEmail(email), token }
}

async function isValid(env: Env, email: string, token: string) {
  if (!env.UNSUBSCRIBE_SECRET || !email || !token) return false
  return verifyUnsubscribeToken(env.UNSUBSCRIBE_SECRET, email, token)
}

export async function onRequestGet({ request, env }: Context): Promise<Response> {
  const { email, token } = await readParams(request)
  if (!(await isValid(env, email, token))) return invalidLink()

  const safe = escapeHtml(email)
  return page('Unsubscribe', `<h1>Unsubscribe from SoloHer emails?</h1>
<p>We'll stop emailing <strong>${safe}</strong>. You can always join again on our site.</p>
<form method="post" action="/api/unsubscribe">
  <input type="hidden" name="e" value="${safe}">
  <input type="hidden" name="t" value="${escapeHtml(token)}">
  <button type="submit">Unsubscribe</button>
</form>
<a class="quiet" href="/">Changed your mind? Return to SoloHer</a>`)
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const { email, token } = await readParams(request)
  if (!(await isValid(env, email, token))) return invalidLink()

  try {
    await env.DB.prepare(
      "UPDATE waitlist SET unsubscribed_at = datetime('now') WHERE email = ? AND unsubscribed_at IS NULL",
    ).bind(email).run()
  } catch {
    return page('Something went wrong', `<h1>Something went wrong</h1>
<p>Please try again in a moment, or reply to any SoloHer email and we'll remove you.</p>`, 500)
  }

  // Same 200 response serves both the confirmation button and mail apps' one-click requests
  return page('Unsubscribed', `<h1>You're unsubscribed</h1>
<p><strong>${escapeHtml(email)}</strong> won't receive any more SoloHer emails.</p>
<a class="btn" href="/">Back to SoloHer</a>`)
}
