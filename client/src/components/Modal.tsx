import { useState, useEffect } from 'react'
import type { ModalState, BoxId } from '../App'

const BOX_NAMES: Record<BoxId, string> = {
  1: 'The Velvet Hour',
  2: 'The Midnight Bloom',
  3: 'The Crimson Reverie',
}

interface ModalProps {
  modal: ModalState
  onClose: () => void
}

export default function Modal({ modal, onClose }: ModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const boxName = modal.boxId ? BOX_NAMES[modal.boxId] : ''
  const isSubscribe = modal.purchaseType === 'subscribe'
  const price = isSubscribe ? '$99.99' : '$129.99'
  const period = isSubscribe ? '/month · cancel anytime' : 'one-time charge'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          box: boxName,
          purchaseType: modal.purchaseType,
        }),
      })
    } catch {
      // proceed regardless — redirect to checkout in production
    }

    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Complete your order">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>✨</div>
            <span className="gold-label modal-gold-label">You're in</span>
            <h2 className="modal-title">Welcome to SoloHer</h2>
            <p className="modal-subtitle">
              We've received your order for <strong style={{ color: 'var(--gold)' }}>{boxName}</strong>.
              Check your inbox — your confirmation and first ritual details are on their way.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ width: '100%', marginTop: '8px' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <span className="gold-label modal-gold-label">
              {isSubscribe ? 'Monthly Subscription' : 'One-Time Purchase'}
            </span>
            <h2 className="modal-title">{boxName}</h2>
            <p className="modal-subtitle">
              You're choosing one of our most {modal.boxId === 2 ? 'popular' : 'beloved'} rituals.
              Enter your details and we'll take care of everything else.
            </p>

            <div className="modal-price-row">
              <span className="modal-price">{price}</span>
              <span className="modal-price-note">{period}</span>
            </div>

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <input
                className="modal-input"
                type="text"
                placeholder="Your first name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
              <input
                className="modal-input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className={`btn-primary modal-submit${loading ? '' : ''}`}
                disabled={loading || !name.trim() || !email.trim()}
              >
                {loading ? 'One moment…' : `Continue to Secure Checkout →`}
              </button>
            </form>

            <p className="modal-disclaimer">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              {isSubscribe && ' You can cancel your subscription at any time.'}
              {' '}All payments are processed securely.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
