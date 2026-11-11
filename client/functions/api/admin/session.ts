// Cloudflare Pages Function: admin sign-in for /admin
//  GET    -> { signedIn, configured }
//  POST   { password } -> sets the session cookie
//  DELETE -> signs out
import { clearedCookie, isAdmin, json, passwordMatches, sessionCookie, type AudioEnv } from '../../../server-lib/audio-admin'

interface Context { request: Request; env: AudioEnv }

export async function onRequestGet({ request, env }: Context) {
  return json({ signedIn: await isAdmin(request, env), configured: Boolean(env.ADMIN_PASSWORD) })
}

export async function onRequestPost({ request, env }: Context) {
  if (!env.ADMIN_PASSWORD) return json({ ok: false, error: 'Admin is not set up yet.' }, 503)
  let password = ''
  try {
    const body = await request.json() as { password?: unknown }
    password = typeof body.password === 'string' ? body.password : ''
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400)
  }
  if (!(await passwordMatches(env, password))) {
    // Slows down password guessing
    await new Promise(r => setTimeout(r, 1000))
    return json({ ok: false, error: 'Wrong password.' }, 401)
  }
  return json({ ok: true }, 200, { 'Set-Cookie': await sessionCookie(env) })
}

export function onRequestDelete() {
  return json({ ok: true }, 200, { 'Set-Cookie': clearedCookie })
}
