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
    wineType: 'Red',
    wineName: 'King Estate Pinot Noir, Willamette Valley 2023',
    wineNotes: 'Silky and elegant, with red cherry and raspberry, a whisper of baking spice and a soft, lingering finish.',
    bathBombName: 'Lavender Rosemary',
    bathBombNotes: 'Soft lavender lifted by fresh, herbal rosemary. Calming and quietly floral, made for slow evenings.',
    storyTheme: 'A slow-burn story of longing and surrender',
  },
  {
    id: 2 as BoxId,
    mood: 'Bold · Confident',
    name: 'The Midnight Bloom',
    tagline: 'For the woman who knows exactly what she wants.',
    wineType: 'White',
    wineName: 'Chalk Hill Chardonnay',
    wineNotes: 'Rich and layered, with ripe pear, golden apple and citrus, rounded out by vanilla and a creamy, toasty finish.',
    bathBombName: 'Oatmeal Milk & Honey',
    bathBombNotes: 'Creamy oat and milk sweetened with golden honey. Soft, comforting, and as velvety as the Chardonnay beside it.',
    storyTheme: 'A story where desire meets its match',
  },
  {
    id: 3 as BoxId,
    mood: 'Deep · Adventurous',
    name: 'The Crimson Reverie',
    tagline: 'For the woman ready to go somewhere deeper.',
    wineType: 'Rosé',
    wineName: "Château d'Esclans Whispering Angel, Côtes de Provence 2025",
    wineNotes: 'Pale, dry and luminous, with fresh strawberry, white peach and citrus and a crisp, mineral finish.',
    bathBombName: 'Honeysuckle',
    bathBombNotes: 'Sweet, sunlit honeysuckle blossom. Light, floral and bright, as fresh as the rosé in your glass.',
    storyTheme: 'A tale of complete surrender and discovery',
  },
]

const PURCHASE_OPTIONS: { type: PurchaseType; label: string }[] = [
  { type: 'subscribe', label: 'Monthly' },
  { type: 'oneTime', label: 'One-time' },
]

export default function BoxSelector({ onSelect }: BoxSelectorProps) {
  // Each card keeps its own purchase choice; monthly is the default
  const [choices, setChoices] = useState<Record<BoxId, PurchaseType>>({ 1: 'subscribe', 2: 'subscribe', 3: 'subscribe' })
  const headerRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>(100)

  return (
    <section className="boxes" id="boxes">
      <div className="boxes-header reveal" ref={headerRef}>
        <span className="gold-label">Curated ritual</span>
        <h2>Choose Your Experience</h2>
        <p>Each box is built around a different mood.<br />Which one is calling to you?</p>
      </div>

      <div className="boxes-grid" ref={gridRef}>
        {BOXES.map((box, i) => (
          <div key={box.id} className={`box-card reveal reveal-d${i + 1}`}>
            <div className="box-mood">{box.mood}</div>
            <div className="box-name">{box.name}</div>
            <p className="box-tagline">{box.tagline}</p>

            <div className="box-contents">
              <div className="box-story">
                <span className="box-story-label">
                  <span role="img" aria-label="Story">📖</span> Your story
                </span>
                <p className="box-story-theme">{box.storyTheme}</p>
              </div>

              <div className="box-pairing-divider">
                <span>Paired with</span>
              </div>

              <div className="box-item">
                <span className="box-item-icon" role="img" aria-label="Wine">🍷</span>
                <div className="box-item-text">
                  <strong>{box.wineType} Wine</strong>
                  <span className="box-item-name">{box.wineName}</span>
                  {box.wineNotes}
                </div>
              </div>
              <div className="box-item">
                <span className="box-item-icon" role="img" aria-label="Bath">🛁</span>
                <div className="box-item-text">
                  <strong>Bath Bomb</strong>
                  <span className="box-item-name">{box.bathBombName}</span>
                  {box.bathBombNotes}
                </div>
              </div>
            </div>

            <div
              className={`purchase-toggle${choices[box.id] === 'oneTime' ? ' is-one-time' : ''}`}
              role="group"
              aria-label={`Purchase options for ${box.name}`}
            >
              <span className="purchase-toggle-thumb" aria-hidden />
              {PURCHASE_OPTIONS.map(opt => {
                const active = choices[box.id] === opt.type
                return (
                  <button
                    key={opt.type}
                    className={`purchase-toggle-btn${active ? ' active' : ''}`}
                    aria-pressed={active}
                    onClick={() => setChoices(prev => ({ ...prev, [box.id]: opt.type }))}
                  >
                    <span className="purchase-toggle-label">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            <button
              className="box-cta"
              onClick={() => onSelect(box.id, choices[box.id])}
            >
              {choices[box.id] === 'subscribe' ? 'Subscribe · $99.99/mo' : 'Buy Once · $124.99'}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
