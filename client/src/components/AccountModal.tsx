import { useEffect } from 'react'
import { SUPPORT_EMAIL } from './FAQ'

interface AccountModalProps {
  onClose: () => void
}

/** Placeholder for "Log in" / "My Account" until customer accounts exist. */
export default function AccountModal({ onClose }: AccountModalProps) {
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
      <div className="modal account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <span className="gold-label modal-gold-label">My account</span>
        <h2 className="modal-title" id="account-title">Accounts are coming soon</h2>
        <p className="modal-subtitle">
          Customer accounts open at launch. You'll be able to manage your subscription, change your box
          options and update your details there.
        </p>
        <p className="modal-subtitle">
          Need help with an order in the meantime? Email us at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
        <button className="btn-primary account-close" onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}
