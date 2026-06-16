import { useScrollReveal } from '../hooks/useScrollReveal'

const REVIEWS = [
  {
    initials: 'S',
    name: 'Sarah M.',
    meta: '34 · Subscribed 8 months',
    box: 'The Midnight Bloom',
    quote:
      "I bought one box on a whim and immediately subscribed. My Tuesday nights are sacred now — my husband knows not to interrupt.",
  },
  {
    initials: 'A',
    name: 'Amanda K.',
    meta: '28 · Subscribed 4 months',
    box: 'The Velvet Hour',
    quote:
      "The packaging is so discreet and beautiful. Nobody knows what's inside but me, and I love that. The story alone is worth it.",
  },
  {
    initials: 'R',
    name: 'Rachel T.',
    meta: '42 · Subscribed 1 year',
    box: 'The Crimson Reverie',
    quote:
      "I've tried other subscription boxes. This one actually understands what women want. It's not just a box — it's permission to enjoy yourself.",
  },
]

export default function Testimonials() {
  const headerRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>(100)

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-header reveal" ref={headerRef}>
        <span className="gold-label">From women who know</span>
        <h2>They Made the Night<br />Their Own</h2>
      </div>

      <div className="testimonials-grid" ref={gridRef}>
        {REVIEWS.map((r, i) => (
          <div key={i} className={`testimonial-card reveal reveal-d${i + 1}`}>
            <div className="testimonial-stars">
              {Array.from({ length: 5 }).map((_, s) => (
                <span key={s} className="star">★</span>
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
          </div>
        ))}
      </div>
    </section>
  )
}
