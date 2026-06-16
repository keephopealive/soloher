import { useEffect, useState } from 'react'

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
      <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <img src="/logo.png" alt="SoloHer" className="navbar-logo" onError={e => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextElementSibling?.removeAttribute('style')
        }} />
        <span className="navbar-logo-text" style={{ display: 'none' }}>SoloHer</span>
      </a>

      <ul className="navbar-links">
        <li><a href="#boxes" onClick={e => { e.preventDefault(); scrollTo('boxes') }}>Our Boxes</a></li>
        <li><a href="#how" onClick={e => { e.preventDefault(); scrollTo('how') }}>How It Works</a></li>
        <li><a href="#faq" onClick={e => { e.preventDefault(); scrollTo('faq') }}>FAQ</a></li>
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

      {menuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(46,18,32,0.98)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
        }}>
          <button onClick={() => setMenuOpen(false)} style={{
            position: 'absolute', top: 28, right: 28,
            color: 'var(--ivory)', fontSize: '1.4rem', background: 'none', border: 'none', cursor: 'pointer',
          }}>✕</button>
          {[['boxes', 'Our Boxes'], ['how', 'How It Works'], ['faq', 'FAQ']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--ivory)',
              background: 'none', border: 'none', cursor: 'pointer',
            }}>{label}</button>
          ))}
          <button className="btn-primary" onClick={() => { setMenuOpen(false); onSubscribeClick() }}>
            Subscribe Now
          </button>
        </div>
      )}
    </nav>
  )
}
