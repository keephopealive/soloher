import { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { PurchaseType } from '../App'
import {
  BOXES, bathBombById, isCustomized, recommendedPairing, wineById,
  type Box, type BoxId, type Pairing,
} from '../data/products'
import PairingCustomizer from './PairingCustomizer'

interface BoxSelectorProps {
  onSelect: (boxId: BoxId, purchaseType: PurchaseType, pairing: Pairing) => void
  preset: { type: PurchaseType; at: number } | null
}

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
  // Each card starts on its recommended pairing; visitors can swap the wine and bath bomb
  const [pairings, setPairings] = useState<Record<BoxId, Pairing>>(() =>
    Object.fromEntries(BOXES.map(b => [b.id, recommendedPairing(b)])) as Record<BoxId, Pairing>,
  )
  const [customizing, setCustomizing] = useState<Box | null>(null)
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
        {BOXES.map((box, i) => {
          const pairing = pairings[box.id]
          const wine = wineById(pairing.wineId)
          const bathBomb = bathBombById(pairing.bathBombId)
          const customized = isCustomized(box, pairing)
          return (
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
                <span className="box-label">{wine.type} wine</span>
                <span className="box-item-name">{wine.name}</span>
                {wine.origin && <span className="box-item-origin">{wine.origin}</span>}
                <span className="box-item-note">{wine.note}</span>
              </div>
            </div>

            <div className="box-item">
              <BathBombIcon />
              <div>
                <span className="box-label">Bath bomb</span>
                <span className="box-item-name">{bathBomb.name}</span>
                <span className="box-item-note">{bathBomb.note}</span>
              </div>
            </div>

            <div className="box-customize">
              {customized && <span className="box-customized-tag">Customized</span>}
              <button className="box-customize-link" onClick={() => setCustomizing(box)}>
                {customized ? 'Edit your pairing' : 'Customize your pairing'}
              </button>
              {customized && (
                <button
                  className="box-reset-link"
                  onClick={() => setPairings(prev => ({ ...prev, [box.id]: recommendedPairing(box) }))}
                >
                  Reset to recommended
                </button>
              )}
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
              onClick={() => onSelect(box.id, choices[box.id], pairing)}
            >
              {choices[box.id] === 'subscribe' ? 'Subscribe · $99.99/mo' : 'Gift Once · $124.99'}
            </button>

            <p className="box-cta-note">
              {choices[box.id] === 'subscribe' ? 'Billed monthly · Cancel anytime' : 'One-time charge · No subscription'}
            </p>
          </article>
          )
        })}
      </div>

      {customizing && (
        <PairingCustomizer
          box={customizing}
          current={pairings[customizing.id]}
          onClose={() => setCustomizing(null)}
          onSave={p => {
            setPairings(prev => ({ ...prev, [customizing.id]: p }))
            setCustomizing(null)
          }}
        />
      )}
    </section>
  )
}
