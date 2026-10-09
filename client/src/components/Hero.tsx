import { useEffect, useState } from 'react'
import heroBox from '../assets/hero-box.webp'

interface HeroProps {
  onSubscribe: () => void
  onOneTime: () => void
}

const ROTATING_WORDS = ['Evening', 'Moment', 'Time']
const ROTATE_INTERVAL_MS = 3000

export default function Hero({ onSubscribe, onOneTime }: HeroProps) {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setWordIndex(i => (i + 1) % ROTATING_WORDS.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-glow" aria-hidden />

      <div className="hero-inner">
        <div className="hero-copy">
          <span className="gold-label hero-label">Curated for women, by women</span>

          <h1 className="hero-headline">
            The{' '}
            <span className="hero-rotator" aria-hidden>
              {ROTATING_WORDS.map((word, i) => (
                <span key={word} className={i === wordIndex ? 'is-active' : undefined}>
                  {word}
                </span>
              ))}
            </span>
            <span className="sr-only">{ROTATING_WORDS[0]}</span>
            <br />
            Is <em>Yours.</em>
          </h1>

          <p className="hero-sub">
            Three pleasures. One ritual. Delivered discreetly to your door each month.
          </p>

          <div className="hero-ctas">
            <button className="btn-primary" onClick={onSubscribe}>
              Start My Monthly Ritual · $99.99
            </button>
            <button className="btn-secondary" onClick={onOneTime}>
              Gift One Ritual · $124.99
            </button>
          </div>

          <p className="hero-trust">
            <span>Discreet packaging</span>
            <span>Cancel anytime</span>
          </p>
        </div>

        <figure className="hero-visual">
          <img
            src={heroBox}
            width={1122}
            height={1402}
            alt="SoloHer box with a 375 ml bottle of wine, a lavender bath bomb and a SoloHer story book"
          />
        </figure>
      </div>

      <a
        href="#boxes"
        className="hero-scroll-cue"
        onClick={e => {
          e.preventDefault()
          document.getElementById('boxes')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <div className="scroll-arrow" aria-hidden />
        <span>Discover</span>
      </a>
    </section>
  )
}
