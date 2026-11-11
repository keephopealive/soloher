// Shared by the audio story functions: which stories are switched off (D1 table audio_settings,
// see db/audio-schema.sql) and the admin sign-in for /admin.
//
// Admin sign-in: one password, the Cloudflare Pages secret ADMIN_PASSWORD (locally in .dev.vars).
// Signing in sets a cookie holding an expiry time plus an HMAC of it keyed by the password, so
// changing the password signs everyone out. No ADMIN_PASSWORD = admin is switched off.

interface D1Result<T> { results?: T[] }
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<unknown>
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>
}
export interface D1Database { prepare(query: string): D1PreparedStatement }

export interface AudioEnv {
  DB: D1Database
  ADMIN_PASSWORD?: string
  ASSETS: { fetch(input: Request | string): Promise<Response> }
}

export const AUDIO_SCHEMA = `CREATE TABLE IF NOT EXISTS audio_settings (
  slug       TEXT PRIMARY KEY,
  enabled    INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`

export interface AudioSetting { slug: string; enabled: number; updated_at: string }

/** Saved on/off settings by slug. A story with no row is on. If the table doesn't exist yet, everything is on. */
export async function audioSettings(db: D1Database): Promise<Map<string, AudioSetting>> {
  try {
    const { results = [] } = await db.prepare('SELECT slug, enabled, updated_at FROM audio_settings').all<AudioSetting>()
    return new Map(results.map(r => [r.slug, r]))
  } catch {
    return new Map()
  }
}

export async function isEnabled(db: D1Database, slug: string): Promise<boolean> {
  return (await audioSettings(db)).get(slug)?.enabled !== 0
}

export async function setEnabled(db: D1Database, slug: string, enabled: boolean): Promise<void> {
  await db.prepare(AUDIO_SCHEMA).run()
  await db
    .prepare(`INSERT INTO audio_settings (slug, enabled, updated_at) VALUES (?, ?, datetime('now'))
              ON CONFLICT(slug) DO UPDATE SET enabled = excluded.enabled, updated_at = excluded.updated_at`)
    .bind(slug, enabled ? 1 : 0)
    .run()
}

// ─── Admin sign-in ───

const COOKIE = 'soloher_admin'
const SESSION_DAYS = 30
const encoder = new TextEncoder()

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)))
  let bin = ''
  for (const byte of sig) bin += String.fromCharCode(byte)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** Compares hashes so the check takes the same time whatever was typed */
export async function passwordMatches(env: AudioEnv, attempt: string): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false
  const [a, b] = await Promise.all([hmac('pw', attempt), hmac('pw', env.ADMIN_PASSWORD)])
  return sameString(a, b)
}

export async function sessionCookie(env: AudioEnv): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 86_400_000
  const value = `${exp}.${await hmac(env.ADMIN_PASSWORD!, `admin:${exp}`)}`
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DAYS * 86_400}`
}

export const clearedCookie = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`

export async function isAdmin(request: Request, env: AudioEnv): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false
  const cookie = request.headers.get('Cookie') ?? ''
  const value = cookie.split(/;\s*/).find(c => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1)
  if (!value) return false
  const [exp, sig] = value.split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  return sameString(sig, await hmac(env.ADMIN_PASSWORD, `admin:${exp}`))
}

export function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  })
}
