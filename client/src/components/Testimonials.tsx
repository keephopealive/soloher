import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

type Platform = 'instagram' | 'tiktok' | 'facebook'

interface ReviewItem {
  kind: 'review'
  initials: string
  name: string
  meta: string
  box: string
  quote: string
}

// Social items are samples for layout only. Replace with real posts
// (shared with the creator's permission) before going live.
interface SocialItem {
  kind: 'social'
  platform: Platform
  handle: string
  caption: string
  box: string
  visual: string
  url: string
}

type Item = ReviewItem | SocialItem

const ITEMS: Item[] = [
  {
    kind: 'review',
    initials: 'S',
    name: 'Sarah M.',
    meta: '34 · Subscribed 8 months',
    box: 'The Midnight Bloom',
    quote:
      "I bought one box on a whim and immediately subscribed. My Tuesday nights are sacred now. My husband knows not to interrupt.",
  },
  {
    kind: 'social',
    platform: 'instagram',
    handle: '@sample.customer',
    caption: 'Sunday reset: bath drawn, glass poured, phone on silent. 🕯️',
    box: 'The Velvet Hour',
    visual: '🛁',
    url: '#',
  },
  {
    kind: 'review',
    initials: 'A',
    name: 'Amanda K.',
    meta: '28 · Subscribed 4 months',
    box: 'The Velvet Hour',
    quote:
      "The packaging is so discreet and beautiful. Nobody knows what's inside but me, and I love that. The story alone is worth it.",
  },
  {
    kind: 'social',
    platform: 'tiktok',
    handle: '@sample.creator',
    caption: 'Unboxing my first SoloHer box. The story card got me. 📖',
    box: 'The Midnight Bloom',
    visual: '📦',
    url: '#',
  },
  {
    kind: 'review',
    initials: 'R',
    name: 'Rachel T.',
    meta: '42 · Subscribed 1 year',
    box: 'The Crimson Reverie',
    quote:
      "I've tried other subscription boxes. This one actually understands what women want. It's not just a box. It's permission to enjoy yourself.",
  },
  {
    kind: 'social',
    platform: 'facebook',
    handle: 'Sample Customer',
    caption: 'Treated myself this month. The rosé and honeysuckle pairing is perfect.',
    box: 'The Crimson Reverie',
    visual: '🍷',
    url: '#',
  },
]

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
}

type Filter = 'all' | 'review' | Platform

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'review', label: 'Reviews' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'facebook', label: 'Facebook' },
]

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
      </svg>
    )
  }
  if (platform === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 3c.5 2.6 2.4 4.4 5 4.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21" fill="currentColor" />
    </svg>
  )
}

function ReviewCard({ r }: { r: ReviewItem }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-stars" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, s) => (
          <span key={s} className="star" aria-hidden>★</span>
        ))}
      </div>
      <p className="testimonial-quote">"{r.quote}"</p>
      <div className="testimonial-author">
        <div className="testimonial-avatar">{r.initials}</div>
        <div>
          <div className="testimonial-name">{r.name}</div>
          <div className="testimonial-meta">{r.meta} · {r.box}</div>
        </div>
      </div>
    </article>
  )
}

function SocialCard({ s }: { s: SocialItem }) {
  return (
    <article className={`social-card social-${s.platform}`}>
      <div className="social-media" aria-hidden>
        <span className="social-visual">{s.visual}</span>
        {s.platform === 'tiktok' && <span className="social-play">▶</span>}
        <span className="social-sample">Sample post</span>
      </div>
      <div className="social-body">
        <div className="social-head">
          <span className="social-badge">
            <PlatformIcon platform={s.platform} />
            {PLATFORM_LABEL[s.platform]}
          </span>
          <span className="social-handle">{s.handle}</span>
        </div>
        <p className="social-caption">{s.caption}</p>
        <div className="social-foot">
          <span className="testimonial-meta">{s.box}</span>
          <a className="social-link" href={s.url} target="_blank" rel="noopener noreferrer">
            View post
          </a>
        </div>
      </div>
    </article>
  )
}

const AUTO_ADVANCE_MS = 5000

export default function Testimonials() {
  const headerRef = useScrollReveal<HTMLDivElement>()
  const carouselRef = useScrollReveal<HTMLDivElement>(100)
  const trackRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [edges, setEdges] = useState({ start: true, end: false })
  // Auto-advance runs until the visitor takes control, and pauses while
  // they hover, touch or focus the carousel, or while it is off screen.
  const [autoStopped, setAutoStopped] = useState(false)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)

  const visible = ITEMS.filter(item =>
    filter === 'all' ? true : filter === 'review' ? item.kind === 'review' : item.kind === 'social' && item.platform === filter,
  )

  const updateEdges = () => {
    const t = trackRef.current
    if (!t) return
    setEdges({ start: t.scrollLeft <= 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 })
  }

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 })
    updateEdges()
  }, [filter])

  useEffect(() => {
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [])

  useEffect(() => {
    const t = trackRef.current
    if (!t) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(t)
    return () => observer.disconnect()
  }, [])

  const step = (dir: 1 | -1) => {
    const t = trackRef.current
    if (!t) return
    const card = t.querySelector<HTMLElement>('.carousel-slide')
    const amount = card ? card.offsetWidth + 16 : t.clientWidth * 0.8
    t.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  useEffect(() => {
    if (autoStopped || paused || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      const t = trackRef.current
      if (!t || t.scrollWidth <= t.clientWidth + 4) return
      const atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4
      if (atEnd) t.scrollTo({ left: 0, behavior: 'smooth' })
      else step(1)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [autoStopped, paused, inView, filter])

  const takeControl = () => setAutoStopped(true)

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-header reveal" ref={headerRef}>
        <span className="gold-label">From women who know</span>
        <h2>They Made the Night<br />Their Own</h2>
      </div>

      <div
        className="testimonials-carousel reveal"
        ref={carouselRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false) }}
      >
        <div className="carousel-toolbar">
          <div className="carousel-filters" role="group" aria-label="Filter reviews and posts">
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`carousel-chip${filter === f.id ? ' active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => { takeControl(); setFilter(f.id) }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="carousel-arrows">
            <button className="carousel-arrow" onClick={() => { takeControl(); step(-1) }} disabled={edges.start} aria-label="Previous">‹</button>
            <button className="carousel-arrow" onClick={() => { takeControl(); step(1) }} disabled={edges.end} aria-label="Next">›</button>
          </div>
        </div>

        <div
          className="carousel-track"
          ref={trackRef}
          onScroll={updateEdges}
          onTouchStart={takeControl}
          onWheel={e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) takeControl() }}
        >
          {visible.map((item, i) => (
            <div key={`${filter}-${i}`} className="carousel-slide">
              {item.kind === 'review' ? <ReviewCard r={item} /> : <SocialCard s={item} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
