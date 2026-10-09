import { useEffect, useState } from 'react'
import logoFull from '../assets/logo-full.webp'

const STORAGE_KEY = 'soloher-age-verified'

function wasVerified() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'yes'
  } catch {
    return false
  }
}

export default function AgeGate() {
  const [status, setStatus] = useState<'ask' | 'denied' | 'verified'>(() => (wasVerified() ? 'verified' : 'ask'))

  useEffect(() => {
    if (status === 'verified') return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [status])

  if (status === 'verified') return null

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'yes')
    } catch {
      // storage unavailable (private mode); they'll be asked again next visit
    }
    setStatus('verified')
  }

  return (
    <div className="modal-overlay age-gate">
      <div className="modal age-gate-modal" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
        <img className="age-gate-logo" src={logoFull} alt="SoloHer" width={640} height={661} />

        {status === 'ask' ? (
          <>
            <span className="gold-label modal-gold-label">Age verification</span>
            <h2 className="modal-title" id="age-gate-title">Are you 21 or older?</h2>
            <p className="modal-subtitle">
              Our boxes include alcohol, so you must be of legal drinking age to enter this site.
            </p>
            <div className="age-gate-actions">
              <button className="btn-primary" onClick={confirm} autoFocus>I am 21 or older</button>
              <button className="btn-secondary" onClick={() => setStatus('denied')}>I am under 21</button>
            </div>
            <p className="modal-disclaimer">Please enjoy responsibly.</p>
          </>
        ) : (
          <>
            <span className="gold-label modal-gold-label">Come back soon</span>
            <h2 className="modal-title" id="age-gate-title">We'll be here when you're 21</h2>
            <p className="modal-subtitle">
              You must be of legal drinking age to visit SoloHer. Thank you for understanding.
            </p>
            <button className="age-gate-back" onClick={() => setStatus('ask')}>
              Entered the wrong answer? Go back
            </button>
          </>
        )}
      </div>
    </div>
  )
}
