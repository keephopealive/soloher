import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import wordmark from '../assets/logo-wordmark.webp'

// Page sections in scroll order; shared by the navbar, phone menu and footer
export const NAV_LINKS = [
  { id: 'boxes', label: 'Our Boxes' },
  { id: 'story', label: 'The Story' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
]

interface NavbarProps {
  onSubscribeClick: () => void
}

export default function Navbar({ onSubscribeClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a href="#" className="navbar-wordmark" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <img src={wordmark} alt="SoloHer" width={900} height={136} />
      </a>

      <ul className="navbar-links">
        {NAV_LINKS.map(({ id, label }) => (
          <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a></li>
        ))}
      </ul>

      <button className="navbar-cta" onClick={onSubscribeClick}>
        Subscribe Now
      </button>

      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Rendered on <body>: the scrolled navbar's backdrop-filter would otherwise
          confine this fixed overlay to the navbar's own box */}
      {menuOpen && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(250,245,248,0.98)',
          zIndex: 150,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
        }}>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{
            position: 'absolute', top: 28, right: 28,
            color: 'var(--text)', fontSize: '1.4rem', background: 'none', border: 'none', cursor: 'pointer',
          }}>✕</button>
          {NAV_LINKS.map(({ id, label }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--text)',
              background: 'none', border: 'none', cursor: 'pointer',
            }}>{label}</button>
          ))}
          <button className="btn-primary" onClick={() => { setMenuOpen(false); onSubscribeClick() }}>
            Subscribe Now
          </button>
        </div>,
        document.body,
      )}
    </nav>
  )
}
