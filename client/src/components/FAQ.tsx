import { useEffect, useState, type ReactNode } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

export const SUPPORT_EMAIL = 'support@soloherbox.com'

/** Open a FAQ answer from elsewhere on the page (e.g. the footer's Returns / Exchanges link) */
export const openFaq = (id: string) =>
  window.dispatchEvent(new CustomEvent('soloher:open-faq', { detail: id }))

// Each answer is one or more paragraphs; `id` lets other parts of the page open it
const FAQS: { id: string; q: string; a: ReactNode[] }[] = [
  {
    id: 'packaging',
    q: 'Is the packaging discreet?',
    a: ['Completely. Your SoloHer box ships in plain packaging with no SoloHer branding on the outside of the shipping box.'],
  },
  {
    id: 'story',
    q: 'What exactly is the short story?',
    a: ['Each story is an original work of intimate fiction written specifically for women. They are sensual, intentional, and beautifully crafted. Literary erotica with defined characters, steamy tension, and writing that allows you to escape, even if just for a moment.'],
  },
  {
    id: 'cancel',
    q: 'Can I cancel my subscription anytime?',
    a: [
      'Yes. Cancel anytime before your next billing date, with no fees or penalties. Just log in to your account to cancel.',
      "If you prepaid for more than one month, we'll refund you for any months that haven't shipped yet.",
    ],
  },
  {
    id: 'options',
    q: 'Do the options change each month?',
    a: ["For our curated boxes, each month brings a new story, paired with new wines and bath bomb scents, so there's always something new to discover."],
  },
  {
    id: 'delivery',
    q: 'How long until my box arrives?',
    a: ['Once your box ships, delivery typically takes 3 to 7 business days, depending on your location. Holidays, weather and carrier delays may affect delivery times.'],
  },
  {
    id: 'change-options',
    q: 'Can I change my box options each month?',
    a: ['Yes. Subscribers can pick a different box or swap their wine and bath bomb before each billing date. Changes apply to your next box.'],
  },
  {
    id: 'refunds',
    q: 'What is your refund policy?',
    a: [
      <>
        Once a box has shipped, refunds aren't offered. If there's any issue with your box when it arrives,
        please reach out to our support team at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and
        we'll work with you to make it right.
      </>,
    ],
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const headerRef = useScrollReveal<HTMLDivElement>()
  const listRef = useScrollReveal<HTMLDivElement>(100)

  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const index = FAQS.findIndex(f => f.id === id)
      if (index < 0) return
      setOpen(index)
      document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener('soloher:open-faq', onOpen)
    return () => window.removeEventListener('soloher:open-faq', onOpen)
  }, [])

  return (
    <section className="faq" id="faq">
      <div className="faq-inner">
        <div className="faq-header reveal" ref={headerRef}>
          <span className="gold-label">Questions answered</span>
          <h2>Everything You<br />Need to Know</h2>
        </div>

        <div ref={listRef} className="reveal reveal-d2">
          {FAQS.map((faq, i) => (
            <div key={faq.id} id={`faq-${faq.id}`} className={`faq-item${open === i ? ' open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {faq.q}
                <span className="faq-chevron" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer" aria-hidden={open !== i}>
                {faq.a.map((para, p) => <p key={p}>{para}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
