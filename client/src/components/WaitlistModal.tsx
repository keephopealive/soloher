import { useEffect } from 'react'
import WaitlistForm from './WaitlistForm'

interface WaitlistModalProps {
  source: string
  onClose: () => void
}

export default function WaitlistModal({ source, onClose }: WaitlistModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal waitlist-modal" role="dialog" aria-modal="true" aria-labelledby="waitlist-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <span className="gold-label modal-gold-label">Launching soon</span>
        <h2 className="modal-title" id="waitlist-title">Be the first to know</h2>
        <p className="modal-subtitle">
          Join the waitlist and we'll email you the moment SoloHer launches.
        </p>
        <WaitlistForm source={source} autoFocus />
        <p className="modal-disclaimer">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  )
}
