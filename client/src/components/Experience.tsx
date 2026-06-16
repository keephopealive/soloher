import { useScrollReveal } from '../hooks/useScrollReveal'

const items = [
  {
    icon: '🍷',
    title: 'Premium Wine',
    desc: 'Two 187ml bottles of handpicked wine — matched precisely to your chosen ritual and mood.',
  },
  {
    icon: '🛁',
    title: 'Luxury Bath Bomb',
    desc: 'Artisan-crafted with essential oils and botanicals. Your bath becomes the opening scene.',
  },
  {
    icon: '📖',
    title: 'An Original Story',
    desc: 'A short story written for women, by women. Intimate, unapologetic, and beautifully written.',
  },
]

export default function Experience() {
  const headerRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>(150)

  return (
    <section className="experience" id="experience">
      <div className="experience-header reveal" ref={headerRef}>
        <span className="gold-label">What's inside every box</span>
        <h2>Three Things.<br />One Perfect Evening.</h2>
      </div>

      <div className="experience-grid" ref={gridRef}>
        {items.map((item, i) => (
          <div key={i} className={`experience-card reveal reveal-d${i + 1}`}>
            <span className="experience-icon" role="img" aria-label={item.title}>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
