import { useEffect, useState } from 'react'
import { BATH_BOMBS, WINES, WINE_TYPES, type Box, type Pairing, type Wine, recommendedPairing } from '../data/products'

const typeSlug = (type: Wine['type']) => (type === 'Rosé' ? 'rose' : type.toLowerCase())

interface PairingCustomizerProps {
  box: Box
  current: Pairing
  onSave: (pairing: Pairing) => void
  onClose: () => void
}

/** Recommended item first, then the rest in catalog order */
function recommendedFirst<T extends { id: string }>(items: T[], recommendedId: string) {
  return [...items].sort((a, b) => Number(b.id === recommendedId) - Number(a.id === recommendedId))
}

export default function PairingCustomizer({ box, current, onSave, onClose }: PairingCustomizerProps) {
  const [wineId, setWineId] = useState(current.wineId)
  const [bathBombId, setBathBombId] = useState(current.bathBombId)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const resetToRecommended = () => {
    const rec = recommendedPairing(box)
    setWineId(rec.wineId)
    setBathBombId(rec.bathBombId)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal customizer" role="dialog" aria-modal="true" aria-labelledby="customizer-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <span className="gold-label modal-gold-label">Customize your pairing</span>
        <h2 className="modal-title" id="customizer-title">{box.name}</h2>

        <div className="customizer-story">
          <span className="customizer-lock" aria-hidden>
            <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          </span>
          <div>
            <span className="customizer-story-label">Your story · part of this box</span>
            <p>{box.storyTheme}</p>
          </div>
        </div>

        <fieldset className="customizer-group">
          <legend>Choose your wine</legend>
          {WINE_TYPES.map(type => (
            <div key={type} className={`wine-category wine-${typeSlug(type)}`}>
              <h3 className="wine-category-title">
                <span className="wine-swatch" aria-hidden />
                {type}
              </h3>
              <div className="customizer-options">
                {recommendedFirst(WINES.filter(w => w.type === type), box.recommendedWine).map(w => (
                  <label key={w.id} className={`option-tile option-wine${wineId === w.id ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name={`wine-${box.id}`}
                      value={w.id}
                      checked={wineId === w.id}
                      onChange={() => setWineId(w.id)}
                      aria-label={`${w.type}: ${w.name}`}
                    />
                    {w.id === box.recommendedWine && (
                      <span className="option-top"><span className="option-badge">Recommended</span></span>
                    )}
                    <span className="option-name">{w.name}</span>
                    {w.origin && <span className="option-origin">{w.origin}</span>}
                    <span className="option-note">{w.note}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset className="customizer-group">
          <legend>Choose your bath bomb</legend>
          <div className="customizer-options">
            {recommendedFirst(BATH_BOMBS, box.recommendedBathBomb).map(b => (
              <label key={b.id} className={`option-tile${bathBombId === b.id ? ' is-selected' : ''}`}>
                <input
                  type="radio"
                  name={`bath-${box.id}`}
                  value={b.id}
                  checked={bathBombId === b.id}
                  onChange={() => setBathBombId(b.id)}
                />
                <span className="option-top">
                  <span className="option-type">Bath bomb</span>
                  {b.id === box.recommendedBathBomb && <span className="option-badge">Recommended</span>}
                </span>
                <span className="option-name">{b.name}</span>
                <span className="option-note">{b.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="customizer-actions">
          <button className="customizer-reset" onClick={resetToRecommended}>Reset to recommended</button>
          <button className="btn-primary customizer-save" onClick={() => onSave({ wineId, bathBombId })}>
            Save my pairing
          </button>
        </div>
      </div>
    </div>
  )
}
