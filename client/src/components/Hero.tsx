interface HeroProps {
  onSubscribe: () => void
  onOneTime: () => void
}

export default function Hero({ onSubscribe, onOneTime }: HeroProps) {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg-glow" aria-hidden />

      <div className="hero-inner">
        <span className="gold-label hero-label">Curated for women, by women</span>

        <h1 className="hero-headline">
          The Evening<br />
          Is <em>Yours.</em>
        </h1>

        <p className="hero-sub">
          Three pleasures. One ritual. Delivered discreetly to your door each month —
          a bath bomb, premium wine, and an original story written entirely for you.
        </p>

        <div className="hero-ctas">
          <button className="btn-primary" onClick={onSubscribe}>
            Start My Monthly Ritual — $99.99
          </button>
          <button className="btn-secondary" onClick={onOneTime}>
            Gift Myself Once — $129.99
          </button>
        </div>

        <p className="hero-trust">
          <span>Free shipping</span>
          <span>Discreet packaging</span>
          <span>Cancel anytime</span>
        </p>
      </div>

      <div className="hero-scroll-cue" aria-hidden>
        <div className="scroll-arrow" />
        <span>Discover</span>
      </div>
    </section>
  )
}
