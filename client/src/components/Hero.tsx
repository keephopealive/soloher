import { useEffect, useState } from 'react'
import WaitlistForm from './WaitlistForm'
import heroBox from '../assets/story-box.webp'

const ROTATING_WORDS = ['Evening', 'Moment', 'Time']
const ROTATE_INTERVAL_MS = 3000

export default function Hero() {
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
            <WaitlistForm source="hero" />
          </div>

          <p className="hero-trust">
            <span>Launching soon</span>
            <span>No spam, unsubscribe anytime</span>
          </p>
        </div>

        <figure className="hero-visual">
          <img
            src={heroBox}
            width={950}
            height={1095}
            alt="Open SoloHer box with a 375 ml bottle of wine, a lavender bath bomb and a SoloHer story book"
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
