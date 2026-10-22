import { useState, type FormEvent } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TOPICS = ['General question', 'My order', 'My account', 'Press or partnerships']

type Status = 'idle' | 'sending' | 'done' | 'error'

/** Contact section. Posts to /api/contact (Cloudflare Pages Function; not available on GitHub Pages). */
export default function Contact() {
  const ref = useScrollReveal<HTMLDivElement>()
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '', website: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const update = (field: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'We couldn\'t send your message. Please try again.')
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We couldn\'t send your message. Please try again.')
      setStatus('error')
    }
  }

  const ready = form.name.trim() && form.email.trim() && form.message.trim()

  return (
    <section className="contact" id="contact">
      <div className="contact-inner reveal" ref={ref}>
        <div className="contact-intro">
          <span className="gold-label">Get in touch</span>
          <h2>We'd love to <em>hear from you.</em></h2>
          <p>
            Questions about a box, a gift or an order? Send us a note and we'll get back to you by email.
          </p>
        </div>

        {status === 'done' ? (
          <div className="contact-done" role="status">
            <strong>Thank you, {form.name.trim().split(' ')[0]}.</strong>
            <span>Your message is on its way. We'll reply to {form.email.trim()}.</span>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="contact-row">
              <label className="contact-field">
                <span>Name</span>
                <input type="text" autoComplete="name" value={form.name} onChange={update('name')} required />
              </label>
              <label className="contact-field">
                <span>Email</span>
                <input type="email" inputMode="email" autoComplete="email" value={form.email} onChange={update('email')} required />
              </label>
            </div>
            <label className="contact-field">
              <span>Topic</span>
              <select value={form.topic} onChange={update('topic')}>
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="contact-field">
              <span>Message</span>
              <textarea rows={5} value={form.message} onChange={update('message')} required />
            </label>
            {/* Honeypot: invisible to visitors, often filled in by bots */}
            <input
              className="contact-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={update('website')}
              aria-hidden
            />
            {status === 'error' && <p className="contact-error" role="alert">{error}</p>}
            <button type="submit" className="btn-primary contact-submit" disabled={!ready || status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
