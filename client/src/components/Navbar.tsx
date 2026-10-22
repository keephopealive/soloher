import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import wordmark from '../assets/logo-wordmark.webp'
import { useTheme } from '../hooks/useTheme'

// Page sections in scroll order; shared by the navbar, phone menu and footer
export const NAV_LINKS = [
  { id: 'boxes', label: 'Boxes' },
  { id: 'story', label: 'Experience' },
  // { id: 'testimonials', label: 'Reviews' }, hidden with the reviews section
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
]

interface NavbarProps {
  onSubscribeClick: () => void
}

export default function Navbar({ onSubscribeClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()

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

      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" aria-hidden>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" />
            </svg>
          )}
        </button>

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
      </div>

      {/* Rendered on <body>: the scrolled navbar's backdrop-filter would otherwise
          confine this fixed overlay to the navbar's own box */}
      {menuOpen && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--menu-bg)',
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
