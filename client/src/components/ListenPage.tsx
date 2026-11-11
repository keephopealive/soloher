import { useEffect, useRef, useState } from 'react'
import logoWordmark from '../assets/logo-wordmark.webp'
import AgeGate from './AgeGate'
import { audioStoryBySlug } from '../data/audioStories'
import { API_BASE } from '../config'

const BASE = import.meta.env.BASE_URL

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Page a story's QR code opens: /listen/<slug>. Open to anyone with the link (no sign-in yet),
// kept out of search engines.
export default function ListenPage({ slug }: { slug: string }) {
  const story = audioStoryBySlug(slug)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)
  // Switched on/off in /admin. If the check fails (e.g. local dev without server functions), the story plays.
  const [status, setStatus] = useState<'checking' | 'on' | 'off'>('checking')

  useEffect(() => {
    if (!story) return
    let cancelled = false
    fetch(`${API_BASE}/api/listen/${slug}`)
      .then(res => (res.ok ? res.json() : null))
      .then((data: { enabled?: boolean } | null) => {
        if (!cancelled) setStatus(data && data.enabled === false ? 'off' : 'on')
      })
      .catch(() => { if (!cancelled) setStatus('on') })
    return () => { cancelled = true }
  }, [slug, story?.slug])

  useEffect(() => {
    document.title = story ? `${story.box.name} | Listen | SoloHer` : 'Story not found | SoloHer'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [story])

  // Title and artwork on the phone's lock screen and headphone controls
  useEffect(() => {
    if (!story || !('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: story.box.name,
      artist: 'SoloHer',
      artwork: [{ src: `${BASE}favicon.png`, type: 'image/png' }],
    })
    navigator.mediaSession.setActionHandler('seekbackward', () => skip(-15))
    navigator.mediaSession.setActionHandler('seekforward', () => skip(15))
  }, [story])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => setError(true))
    else audio.pause()
  }

  const skip = (by: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(Math.max(audio.currentTime + by, 0), audio.duration || 0)
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrent(value)
  }

  return (
    <div className="listen-page">
      <header className="listen-header">
        <a href={BASE} aria-label="SoloHer home">
          <img className="listen-logo" src={logoWordmark} alt="SoloHer" />
        </a>
      </header>

      <main className="listen-main">
        {story ? (
          <div className="listen-card">
            <span className="gold-label">Your story · Audio</span>
            <p className="listen-mood">{story.box.mood}</p>
            <h1 className="listen-title">{story.box.name}</h1>
            <p className="listen-theme">{story.box.storyTheme}</p>
            {status === 'off' && (
              <p className="listen-off-note">
                This recording isn't available right now. Please check back soon.
              </p>
            )}
            {status === 'on' && story.sample && (
              <p className="listen-sample-note">Sample recording. The full audiobook is coming soon.</p>
            )}

            {status === 'on' && <>
            <audio
              ref={audioRef}
              src={`${BASE}audio/${story.file}`}
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
              onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
              onDurationChange={e => setDuration(e.currentTarget.duration)}
              onError={() => setError(true)}
            />

            <div className="listen-player">
              <div className="listen-controls">
                <button className="listen-skip" onClick={() => skip(-15)} aria-label="Back 15 seconds">−15</button>
                <button
                  className="listen-play"
                  onClick={toggle}
                  aria-label={playing ? 'Pause' : 'Play'}
                  disabled={error}
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" />
                    </svg>
                  )}
                </button>
                <button className="listen-skip" onClick={() => skip(15)} aria-label="Forward 15 seconds">+15</button>
              </div>

              <input
                className="listen-progress"
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={current}
                onChange={e => seek(Number(e.target.value))}
                aria-label="Position in the story"
                style={{ '--progress': `${duration ? (current / duration) * 100 : 0}%` } as React.CSSProperties}
              />
              <div className="listen-times">
                <span>{formatTime(current)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {error && (
                <p className="listen-error">This recording couldn't be loaded. Please try again in a moment.</p>
              )}
            </div>
            </>}
          </div>
        ) : (
          <div className="listen-card">
            <span className="gold-label">Not found</span>
            <h1 className="listen-title">We couldn't find this story</h1>
            <p className="listen-theme">Check that you scanned the code on your story card, or visit our home page.</p>
            <a className="btn-primary listen-home" href={BASE}>Go to SoloHer</a>
          </div>
        )}
      </main>

      <AgeGate />
    </div>
  )
}
