import type { ReactNode } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import boxOpen from '../assets/story-box.webp'

const FEATURES: { key: string; title: ReactNode; detail: string; gold?: boolean }[] = [
  { key: 'story', title: 'Original story', detail: 'exclusive to SoloHer', gold: true },
  // "mL" keeps its lowercase inside the all-caps label
  { key: 'wine', title: <>375 <span className="keep-case">mL</span> wine</>, detail: "the evening's pour" },
  { key: 'bath', title: 'Bath bomb', detail: 'the room, set' },
]

export default function StorySection() {
  const headerRef = useScrollReveal<HTMLDivElement>()
  const stageRef = useScrollReveal<HTMLDivElement>(100)

  return (
    <section className="story" id="story">
      <div className="story-header reveal" ref={headerRef}>
        <span className="gold-label">An original story in every box</span>
        <h2>
          Some stories are for everyone.<br />
          <em>This one isn't.</em>
        </h2>
        <p>Written by real authors, only for SoloHer. A new one every month.</p>
      </div>

      <div className="story-stage reveal" ref={stageRef}>
        <figure className="story-visual">
          <img
            src={boxOpen}
            width={950}
            height={1095}
            alt="Open SoloHer box showing the story book, a bottle of wine and a bath bomb"
            loading="lazy"
          />
          {/* Callout line pointing at the story book */}
          <div className="story-callout" aria-hidden>
            <strong>Original story</strong>
            <span>Written by real authors. Yours only.</span>
          </div>
        </figure>

        <ul className="story-features">
          {FEATURES.map(f => (
            <li key={f.key}>
              <span className={`story-feature-title${f.gold ? ' is-gold' : ''}`}>{f.title}</span>
              <span className="story-feature-detail">{f.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
