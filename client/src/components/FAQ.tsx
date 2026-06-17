import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const FAQS = [
  {
    q: 'Is the packaging discreet?',
    a: "Completely. Your SoloHer box ships in plain, unmarked packaging with no visible branding on the outside. Your bank statement will show a neutral company name. Only you know what's inside.",
  },
  {
    q: 'What exactly is the short story?',
    a: "Each story is an original work of intimate fiction written specifically for women, by women. They are sensual, empowering, and beautifully crafted. Think literary erotica: real characters, real tension, and writing that respects your intelligence.",
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: "Yes, cancel with zero fees or penalties at any time. Log into your account and cancel before your next billing date. No hoops, no guilt-trip emails.",
  },
  {
    q: 'Do the wines change each month?',
    a: "For subscribers, yes. Each month brings new wine selections within your chosen tier. One-time purchasers receive the current seasonal curation. Every selection is chosen by our sommelier partner to complement the mood of the box.",
  },
  {
    q: 'How long until my box arrives?',
    a: "Orders ship within 2 business days. Delivery takes 3-7 business days depending on your location. Subscribers receive a tracking notification the moment their box ships.",
  },
  {
    q: 'Can I switch my box tier?',
    a: "Absolutely. Log into your account and update your preference before the next billing cycle. You can switch tiers as often as you like.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const headerRef = useScrollReveal<HTMLDivElement>()
  const listRef = useScrollReveal<HTMLDivElement>(100)

  return (
    <section className="faq" id="faq">
      <div className="faq-inner">
        <div className="faq-header reveal" ref={headerRef}>
          <span className="gold-label">Questions answered</span>
          <h2>Everything You<br />Need to Know</h2>
        </div>

        <div ref={listRef} className="reveal reveal-d2">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
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
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
