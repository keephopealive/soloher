import { useState, type FormEvent } from 'react'

interface WaitlistFormProps {
  /** Where the sign-up came from (hero, navbar, a box name); saved with the email */
  source: string
  autoFocus?: boolean
  className?: string
}

type Status = 'idle' | 'sending' | 'done' | 'error'

/** Email capture for the pre-sale waitlist. Posts to /api/waitlist (Cloudflare Pages Function). */
export default function WaitlistForm({ source, autoFocus, className }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot, hidden from people
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const inputId = `waitlist-email-${source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, website }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className={`waitlist-done${className ? ` ${className}` : ''}`} role="status">
        <strong>You're on the list.</strong>
        <span>We'll email you the moment SoloHer launches.</span>
      </div>
    )
  }

  return (
    <form className={`waitlist-form${className ? ` ${className}` : ''}`} onSubmit={submit} noValidate>
      <div className="waitlist-row">
        <label className="sr-only" htmlFor={inputId}>Email address</label>
        <input
          id={inputId}
          className="waitlist-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus={autoFocus}
        />
        <button type="submit" className="btn-primary waitlist-submit" disabled={status === 'sending' || !email.trim()}>
          {status === 'sending' ? 'Joining…' : 'Join the Waitlist'}
        </button>
      </div>
      {/* Honeypot: invisible to visitors, often filled in by bots */}
      <input
        className="waitlist-hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        aria-hidden
      />
      {status === 'error' && <p className="waitlist-error" role="alert">{error}</p>}
    </form>
  )
}
