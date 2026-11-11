// Cloudflare Pages Function: serves /audio/<file>.
// - A story switched off in /admin returns 404, except for a signed-in admin (so /admin can still preview it).
// - Answers byte-range requests itself (206 Partial Content). Cloudflare Pages' static file serving ignores
//   "Range" headers, and iPhones/Safari need them to play and skip through audio.
import { AUDIO_STORIES } from '../../src/data/audioStories'
import { isAdmin, isEnabled, type AudioEnv } from '../../server-lib/audio-admin'

interface Context { request: Request; env: AudioEnv; params: { file: string } }

function parseRange(header: string, size: number): { start: number; end: number } | null {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (!m || (m[1] === '' && m[2] === '')) return null
  let start: number
  let end: number
  if (m[1] === '') {
    // "bytes=-500": the last 500 bytes
    start = Math.max(size - Number(m[2]), 0)
    end = size - 1
  } else {
    start = Number(m[1])
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1)
  }
  return start <= end && start < size ? { start, end } : null
}

export async function onRequest({ request, env, params }: Context) {
  const story = AUDIO_STORIES.find(s => s.file === params.file)
  if (story && !(await isEnabled(env.DB, story.slug)) && !(await isAdmin(request, env))) {
    return new Response('Not available', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  // Plain GET for the whole file (the asset server ignores Range anyway)
  const asset = await env.ASSETS.fetch(new Request(request.url))
  if (!asset.ok || !params.file.endsWith('.mp3')) return asset

  const headers = new Headers(asset.headers)
  headers.set('Content-Type', 'audio/mpeg')
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'no-cache')
  headers.delete('Content-Encoding')

  const rangeHeader = request.headers.get('Range')
  if (!rangeHeader) {
    return new Response(request.method === 'HEAD' ? null : asset.body, { status: 200, headers })
  }

  const data = await asset.arrayBuffer()
  const size = data.byteLength
  const range = parseRange(rangeHeader, size)
  if (!range) {
    headers.set('Content-Range', `bytes */${size}`)
    headers.delete('Content-Length')
    return new Response(null, { status: 416, headers })
  }
  const length = range.end - range.start + 1
  headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`)
  headers.set('Content-Length', String(length))
  // A view into the buffer, not a copy
  const body = request.method === 'HEAD' ? null : new Uint8Array(data, range.start, length)
  return new Response(body, { status: 206, headers })
}
