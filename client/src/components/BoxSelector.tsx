import { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { BoxId, PurchaseType } from '../App'

interface BoxSelectorProps {
  onSelect: (boxId: BoxId, purchaseType: PurchaseType) => void
  preset: { type: PurchaseType; at: number } | null
}

const BOXES = [
  {
    id: 1 as BoxId,
    mood: 'Tender · Romantic',
    name: 'The Velvet Hour',
    tagline: 'For the woman who craves tenderness.',
    storyTheme: 'A slow-burn story of longing and surrender',
    wineType: 'Red wine',
    wineName: 'King Estate Pinot Noir',
    wineOrigin: 'Willamette Valley · 2023',
    wineNote: 'Silky red cherry, raspberry and soft spice.',
    bathBombName: 'Lavender Rosemary',
    bathBombNote: 'Calming lavender with fresh, herbal rosemary.',
  },
  {
    id: 2 as BoxId,
    mood: 'Bold · Confident',
    name: 'The Midnight Bloom',
    tagline: 'For the woman who knows exactly what she wants.',
    storyTheme: 'A story where desire meets its match',
    wineType: 'White wine',
    wineName: 'Chalk Hill Chardonnay',
    wineOrigin: '',
    wineNote: 'Ripe pear and golden apple with creamy vanilla.',
    bathBombName: 'Oatmeal Milk & Honey',
    bathBombNote: 'Creamy oat and golden honey, soft and comforting.',
  },
  {
    id: 3 as BoxId,
    mood: 'Deep · Adventurous',
    name: 'The Crimson Reverie',
    tagline: 'For the woman ready to go somewhere deeper.',
    storyTheme: 'A tale of complete surrender and discovery',
    wineType: 'Rosé wine',
    wineName: 'Whispering Angel Rosé',
    wineOrigin: "Château d'Esclans · Côtes de Provence · 2025",
    wineNote: 'Dry and bright, with strawberry and white peach.',
    bathBombName: 'Honeysuckle',
    bathBombNote: 'Sweet, sunlit honeysuckle blossom.',
  },
]

const PURCHASE_OPTIONS: { type: PurchaseType; label: string; badge?: string }[] = [
  { type: 'subscribe', label: 'Monthly', badge: 'Save $25' },
  { type: 'oneTime', label: 'One-time gift' },
]

function BookIcon() {
  return (
    <svg className="box-icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" />
      <path d="M12 6.5v13" />
    </svg>
  )
}

function WineIcon() {
  return (
    <svg className="box-icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M7.5 3h9l-.5 5.5a4 4 0 0 1-8 0Z" />
      <path d="M8 7h8" />
      <path d="M12 12.5V20" />
      <path d="M8.5 20.5h7" />
    </svg>
  )
}

function BathBombIcon() {
  return (
    <svg className="box-icon" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11.5" cy="13.5" r="6.5" />
      <path d="M5.2 14c4 1.6 8.6 1.6 12.6 0" />
      <path d="M18.5 3v3.4M16.8 4.7h3.4" />
    </svg>
  )
}

export default function BoxSelector({ onSelect, preset }: BoxSelectorProps) {
  // Each card keeps its own purchase choice; monthly is the default
  const [choices, setChoices] = useState<Record<BoxId, PurchaseType>>({ 1: 'subscribe', 2: 'subscribe', 3: 'subscribe' })
  const headerRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>(100)

  useEffect(() => {
    if (preset) setChoices({ 1: preset.type, 2: preset.type, 3: preset.type })
  }, [preset])

  return (
    <section className="boxes" id="boxes">
      <div className="boxes-header reveal" ref={headerRef}>
        <span className="gold-label">Curated ritual</span>
        <h2>Choose Your Experience</h2>
        <p>Each box is built around a different mood.<br />Which one is calling to you?</p>
      </div>

      {/* Cards share row tracks (subgrid), so each part lines up across all three */}
      <div className="boxes-grid" ref={gridRef}>
        {BOXES.map((box, i) => (
          <article key={box.id} className={`box-card reveal reveal-d${i + 1}`}>
            <div className="box-mood">{box.mood}</div>
            <h3 className="box-name">{box.name}</h3>
            <p className="box-tagline">{box.tagline}</p>

            <div className="box-story">
              <span className="box-label box-label-rose"><BookIcon /> Your story</span>
              <p className="box-story-theme">{box.storyTheme}</p>
            </div>

            <div className="box-pairing-divider"><span>Paired with</span></div>

            <div className="box-item">
              <WineIcon />
              <div>
                <span className="box-label">{box.wineType}</span>
                <span className="box-item-name">{box.wineName}</span>
                {box.wineOrigin && <span className="box-item-origin">{box.wineOrigin}</span>}
                <span className="box-item-note">{box.wineNote}</span>
              </div>
            </div>

            <div className="box-item">
              <BathBombIcon />
              <div>
                <span className="box-label">Bath bomb</span>
                <span className="box-item-name">{box.bathBombName}</span>
                <span className="box-item-note">{box.bathBombNote}</span>
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
                    {opt.badge && <span className="purchase-toggle-badge">{opt.badge}</span>}
                  </button>
                )
              })}
            </div>

            <button
              className="box-cta"
              onClick={() => onSelect(box.id, choices[box.id])}
            >
              {choices[box.id] === 'subscribe' ? 'Subscribe · $99.99/mo' : 'Gift Once · $124.99'}
            </button>

            <p className="box-cta-note">
              {choices[box.id] === 'subscribe' ? 'Billed monthly · Cancel anytime' : 'One-time charge · No subscription'}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
