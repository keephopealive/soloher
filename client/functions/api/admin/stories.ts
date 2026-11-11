// Cloudflare Pages Function: audio stories for /admin (signed-in admin only)
//  GET  -> every story in src/data/audioStories.ts with its on/off state and file size
//  POST { slug, enabled } -> switches a story on or off
import { AUDIO_STORIES, audioStoryBySlug } from '../../../src/data/audioStories'
import { audioSettings, isAdmin, json, setEnabled, type AudioEnv } from '../../../server-lib/audio-admin'

interface Context { request: Request; env: AudioEnv }

async function fileSize(env: AudioEnv, request: Request, file: string): Promise<number | null> {
  try {
    // Static file serving doesn't always send Content-Length (never for HEAD), so read the file if needed
    const res = await env.ASSETS.fetch(new Request(new URL(`/audio/${file}`, request.url)))
    if (!res.ok) return null
    const length = Number(res.headers.get('Content-Length'))
    if (Number.isFinite(length) && length > 0) {
      res.body?.cancel()
      return length
    }
    return (await res.arrayBuffer()).byteLength
  } catch {
    return null
  }
}

export async function onRequestGet({ request, env }: Context) {
  if (!(await isAdmin(request, env))) return json({ ok: false, error: 'Please sign in.' }, 401)
  const settings = await audioSettings(env.DB)
  const stories = await Promise.all(
    AUDIO_STORIES.map(async s => {
      const story = audioStoryBySlug(s.slug)!
      const setting = settings.get(s.slug)
      return {
        slug: s.slug,
        name: story.box.name,
        mood: story.box.mood,
        file: s.file,
        sample: Boolean(s.sample),
        size: await fileSize(env, request, s.file),
        enabled: setting?.enabled !== 0,
        updatedAt: setting?.updated_at ?? null,
      }
    }),
  )
  return json({ ok: true, stories })
}

export async function onRequestPost({ request, env }: Context) {
  if (!(await isAdmin(request, env))) return json({ ok: false, error: 'Please sign in.' }, 401)
  let slug = ''
  let enabled: unknown
  try {
    const body = await request.json() as { slug?: unknown; enabled?: unknown }
    slug = typeof body.slug === 'string' ? body.slug : ''
    enabled = body.enabled
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400)
  }
  if (!audioStoryBySlug(slug) || typeof enabled !== 'boolean') return json({ ok: false, error: 'Unknown story' }, 400)
  try {
    await setEnabled(env.DB, slug, enabled)
  } catch {
    return json({ ok: false, error: 'Could not save. Please try again.' }, 500)
  }
  return json({ ok: true })
}
