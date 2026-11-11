import { useCallback, useEffect, useState, type FormEvent } from 'react'
import logoWordmark from '../assets/logo-wordmark.webp'

// /admin: audio stories that are on the site, with an on/off switch for each.
// Needs the Cloudflare server functions (functions/api/admin/*), so it works on soloherbox.com
// and `npm run dev:cloudflare`, not on GitHub Pages or the plain Vite dev server.
const BASE = import.meta.env.BASE_URL

interface AdminStory {
  slug: string
  name: string
  mood: string
  file: string
  sample: boolean
  size: number | null
  enabled: boolean
  updatedAt: string | null
}

type Session = 'loading' | 'unavailable' | 'not-configured' | 'signed-out' | 'signed-in'

const formatSize = (bytes: number | null) => (bytes ? `${(bytes / 1_048_576).toFixed(1)} MB` : 'size unknown')
const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
// D1 stores UTC as "YYYY-MM-DD HH:MM:SS"
const formatDate = (utc: string) =>
  new Date(`${utc.replace(' ', 'T')}Z`).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

async function api<T>(path: string, init?: RequestInit): Promise<{ status: number; data: T | null }> {
  try {
    const res = await fetch(`/api/admin/${path}`, {
      ...init,
      credentials: 'same-origin',
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    })
    const isJson = res.headers.get('Content-Type')?.includes('application/json')
    return { status: res.status, data: isJson ? await res.json() : null }
  } catch {
    return { status: 0, data: null }
  }
}

export default function AdminPage() {
  const [session, setSession] = useState<Session>('loading')
  const [stories, setStories] = useState<AdminStory[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Admin | SoloHer'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  const loadStories = useCallback(async () => {
    const { status, data } = await api<{ stories: AdminStory[] }>('stories')
    if (status === 401) return setSession('signed-out')
    if (!data?.stories) return setError('Could not load the stories. Please refresh.')
    setStories(data.stories)
  }, [])

  useEffect(() => {
    api<{ signedIn: boolean; configured: boolean }>('session').then(({ data }) => {
      if (!data) return setSession('unavailable')
      if (!data.configured) return setSession('not-configured')
      setSession(data.signedIn ? 'signed-in' : 'signed-out')
    })
  }, [])

  useEffect(() => {
    if (session === 'signed-in') loadStories()
  }, [session, loadStories])

  const signOut = async () => {
    await api('session', { method: 'DELETE' })
    setStories(null)
    setSession('signed-out')
  }

  const toggle = async (story: AdminStory) => {
    const enabled = !story.enabled
    setError('')
    setStories(list => list?.map(s => (s.slug === story.slug ? { ...s, enabled } : s)) ?? null)
    const { status, data } = await api<{ ok: boolean; error?: string }>('stories', {
      method: 'POST',
      body: JSON.stringify({ slug: story.slug, enabled }),
    })
    if (status === 401) return setSession('signed-out')
    if (!data?.ok) {
      setStories(list => list?.map(s => (s.slug === story.slug ? { ...s, enabled: !enabled } : s)) ?? null)
      return setError(data?.error ?? 'Could not save. Please try again.')
    }
    loadStories()
  }

  const live = stories?.filter(s => s.enabled).length ?? 0

  return (
    <div className="admin-page">
      <header className="admin-header">
        <a href={BASE} aria-label="SoloHer home">
          <img className="admin-logo" src={logoWordmark} alt="SoloHer" />
        </a>
        <span className="admin-header-label">Admin</span>
        {session === 'signed-in' && (
          <button className="admin-signout" onClick={signOut}>Sign out</button>
        )}
      </header>

      <main className="admin-main">
        {session === 'loading' && <p className="admin-dim">Loading…</p>}

        {session === 'unavailable' && (
          <Notice title="Admin isn't available here">
            The admin page runs on www.soloherbox.com (or <code>npm run dev:cloudflare</code> on this computer).
          </Notice>
        )}

        {session === 'not-configured' && (
          <Notice title="Admin isn't set up yet">
            An admin password needs to be added to the site's settings before anyone can sign in.
          </Notice>
        )}

        {session === 'signed-out' && <SignIn onSignedIn={() => setSession('signed-in')} />}

        {session === 'signed-in' && (
          <>
            <div className="admin-title-row">
              <div>
                <span className="gold-label">Audio stories</span>
                <h1 className="admin-title">What's on the site</h1>
              </div>
              {stories && (
                <p className="admin-summary">
                  <strong>{live}</strong> live · <strong>{stories.length - live}</strong> off
                </p>
              )}
            </div>
            <p className="admin-dim admin-intro">
              Switching a story off hides its player and blocks its MP3 right away. Its QR code keeps working
              and shows "not available right now" until you switch it back on. To add a new story, ask for it to be added to the site.
            </p>

            {error && <p className="admin-error" role="alert">{error}</p>}
            {!stories && !error && <p className="admin-dim">Loading stories…</p>}

            <ul className="admin-list">
              {stories?.map(story => <StoryRow key={story.slug} story={story} onToggle={() => toggle(story)} />)}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

function StoryRow({ story, onToggle }: { story: AdminStory; onToggle: () => void }) {
  const [duration, setDuration] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}${BASE}listen/${story.slug}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link:', link)
    }
  }

  return (
    <li className={`admin-story${story.enabled ? '' : ' is-off'}`}>
      <div className="admin-story-top">
        <div className="admin-story-info">
          <div className="admin-story-tags">
            <span className={`admin-pill ${story.enabled ? 'is-live' : 'is-off'}`}>
              {story.enabled ? 'Live' : 'Off'}
            </span>
            {story.sample && <span className="admin-pill is-sample">Sample</span>}
          </div>
          <h2 className="admin-story-name">{story.name}</h2>
          <p className="admin-dim">{story.mood}</p>
        </div>
        <button
          className="admin-switch"
          role="switch"
          aria-checked={story.enabled}
          aria-label={`${story.name}: ${story.enabled ? 'live' : 'off'}`}
          onClick={onToggle}
        >
          <span className="admin-switch-knob" />
        </button>
      </div>

      <dl className="admin-meta">
        <div><dt>Link</dt><dd><a href={link} target="_blank" rel="noreferrer">{link.replace(/^https?:\/\//, '')}</a></dd></div>
        <div>
          <dt>File</dt>
          <dd>{story.file} · {formatSize(story.size)}{duration ? ` · ${formatTime(duration)}` : ''}</dd>
        </div>
        <div><dt>Last switched</dt><dd>{story.updatedAt ? formatDate(story.updatedAt) : 'Never (on by default)'}</dd></div>
      </dl>

      <div className="admin-story-actions">
        <audio
          controls
          preload="metadata"
          src={`${BASE}audio/${story.file}`}
          onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        />
        <button className="admin-copy" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
      </div>
    </li>
  )
}

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { data } = await api<{ ok: boolean; error?: string }>('session', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
    setBusy(false)
    if (data?.ok) onSignedIn()
    else setError(data?.error ?? 'Something went wrong. Please try again.')
  }

  return (
    <form className="admin-signin" onSubmit={submit}>
      <span className="gold-label">Admin</span>
      <h1 className="admin-title">Sign in</h1>
      <label className="admin-label" htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
        className="admin-input"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoFocus
        required
      />
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="btn-primary admin-signin-btn" type="submit" disabled={busy || !password}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-signin">
      <span className="gold-label">Admin</span>
      <h1 className="admin-title">{title}</h1>
      <p className="admin-dim">{children}</p>
    </div>
  )
}
