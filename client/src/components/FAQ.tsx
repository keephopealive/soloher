import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

// Each answer is one or more paragraphs
const FAQS: { q: string; a: string[] }[] = [
  {
    q: 'Is the packaging discreet?',
    a: ['Completely. Your SoloHer box ships in plain, unmarked packaging with no visible branding on the outside.'],
  },
  {
    q: 'What exactly is the short story?',
    a: ['Each story is an original work of intimate fiction written specifically for women. They are sensual, intentional, and beautifully crafted. Literary erotica with defined characters, steamy tension, and writing that allows you to escape, even if just for a moment.'],
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: [
      'Yes. Cancel anytime before your next box ships, with no fees or penalties. Just log into your account and cancel before your next billing date. No hoops, no guilt-trip emails.',
      "If you prepaid for more than one month, we'll refund you for any months that haven't shipped yet.",
    ],
  },
  {
    q: 'Do the options change each month?',
    a: ["Each month, we introduce new wines, bath bomb scents, and stories, so there's always something new to discover."],
  },
  {
    q: 'How long until my box arrives?',
    a: ['Delivery takes 3 to 7 business days, depending on your location. Holidays may affect delivery times.'],
  },
  {
    q: 'Can I change my box options each month?',
    a: ['Yes. Before each billing date, you can pick a different box or swap your wine and bath bomb. Your changes apply to your next box.'],
  },
  {
    q: 'What is your refund policy?',
    a: ["Refunds aren't offered once a box has been delivered. If there's any issue with your box when it arrives, please reach out to our support team and we'll work with you to make it right."],
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
                {faq.a.map((para, p) => <p key={p}>{para}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
