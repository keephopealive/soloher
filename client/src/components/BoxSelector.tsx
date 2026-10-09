import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { BoxId, PurchaseType } from '../App'

interface BoxSelectorProps {
  onSelect: (boxId: BoxId, purchaseType: PurchaseType) => void
}

const BOXES = [
  {
    id: 1 as BoxId,
    mood: 'Tender · Romantic',
    name: 'The Velvet Hour',
    tagline: 'For the woman who craves tenderness.',
    featured: false,
    wine: 'Pinot Noir — silky, delicate, and effortlessly smooth',
    bathBomb: 'Lavender & Rose Quartz — calming, floral, made for slow evenings',
    storyTheme: 'A slow-burn story of longing and surrender',
  },
  {
    id: 2 as BoxId,
    mood: 'Bold · Confident',
    name: 'The Midnight Bloom',
    tagline: 'For the woman who knows exactly what she wants.',
    featured: true,
    wine: 'Cabernet Sauvignon — bold, full-bodied, and unapologetically rich',
    bathBomb: 'Midnight Jasmine & Black Orchid — intoxicating, mysterious, unforgettable',
    storyTheme: 'A story where desire meets its match',
  },
  {
    id: 3 as BoxId,
    mood: 'Deep · Adventurous',
    name: 'The Crimson Reverie',
    tagline: 'For the woman ready to go somewhere deeper.',
    featured: false,
    wine: 'Merlot & Syrah Blend — complex, dark, and deeply satisfying',
    bathBomb: 'Cherry Blossom & Sandalwood — warm, exotic, transformative',
    storyTheme: 'A tale of complete surrender and discovery',
  },
]

export default function BoxSelector({ onSelect }: BoxSelectorProps) {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('subscribe')
  const headerRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>(100)

  const price = purchaseType === 'subscribe' ? '$99.99' : '$124.99'
  const period = purchaseType === 'subscribe' ? '/month' : 'one-time'

  return (
    <section className="boxes" id="boxes">
      <div className="boxes-header reveal" ref={headerRef}>
        <span className="gold-label">Curated ritual</span>
        <h2>Choose Your Experience</h2>
        <p>Each box is built around a different mood.<br />Which one is calling to you?</p>
      </div>

      <div
        className={`pricing-toggle${purchaseType === 'oneTime' ? ' is-one-time' : ''}`}
        role="group"
        aria-label="Purchase type"
      >
        <span className="toggle-thumb" aria-hidden />
        <button
          className={`toggle-btn${purchaseType === 'subscribe' ? ' active' : ''}`}
          aria-pressed={purchaseType === 'subscribe'}
          onClick={() => setPurchaseType('subscribe')}
        >
          <span className="toggle-label">Monthly Subscription</span>
          <span className="toggle-price">$99.99</span>
        </button>
        <button
          className={`toggle-btn${purchaseType === 'oneTime' ? ' active' : ''}`}
          aria-pressed={purchaseType === 'oneTime'}
          onClick={() => setPurchaseType('oneTime')}
        >
          <span className="toggle-label">One-Time Purchase</span>
          <span className="toggle-price">$124.99</span>
        </button>
      </div>

      <div className="boxes-grid" ref={gridRef}>
        {BOXES.map((box, i) => (
          <div
            key={box.id}
            className={`box-card reveal reveal-d${i + 1}${box.featured ? ' featured' : ''}`}
          >
            {box.featured && <div className="box-badge">Most Popular</div>}

            <div className="box-mood">{box.mood}</div>
            <div className="box-name">{box.name}</div>
            <p className="box-tagline">{box.tagline}</p>

            <div className="box-divider" />

            <div className="box-contents">
              <div className="box-item">
                <span className="box-item-icon" role="img" aria-label="Wine">🍷</span>
                <div className="box-item-text">
                  <strong>Wine Selection</strong>
                  {box.wine}
                </div>
              </div>
              <div className="box-item">
                <span className="box-item-icon" role="img" aria-label="Bath">🛁</span>
                <div className="box-item-text">
                  <strong>Bath Bomb</strong>
                  {box.bathBomb}
                </div>
              </div>
              <div className="box-item">
                <span className="box-item-icon" role="img" aria-label="Story">📖</span>
                <div className="box-item-text">
                  <strong>Original Story</strong>
                  {box.storyTheme}
                </div>
              </div>
            </div>

            <div className="box-price-row">
              <div className="box-price">{price}</div>
              <div className="box-price-period">{period}</div>
            </div>

            <button
              className="box-cta"
              onClick={() => onSelect(box.id, purchaseType)}
            >
              {purchaseType === 'subscribe' ? `Subscribe to ${box.name}` : `Order ${box.name}`}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
