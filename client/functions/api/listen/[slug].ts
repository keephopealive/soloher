// Cloudflare Pages Function: GET /api/listen/<slug> -> { exists, enabled }
// The listen page asks this so a story switched off in /admin shows "not available" instead of a broken player.
import { audioStoryBySlug } from '../../../src/data/audioStories'
import { isEnabled, json, type AudioEnv } from '../../../server-lib/audio-admin'

interface Context { request: Request; env: AudioEnv; params: { slug: string } }

// The GitHub Pages test site calls this from another origin
const ALLOWED_ORIGINS = ['https://keephopealive.github.io']

export async function onRequestGet({ request, env, params }: Context) {
  const origin = request.headers.get('Origin') ?? ''
  const cors: Record<string, string> = ALLOWED_ORIGINS.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
    : {}
  const exists = Boolean(audioStoryBySlug(params.slug))
  return json({ exists, enabled: exists && (await isEnabled(env.DB, params.slug)) }, 200, cors)
}
