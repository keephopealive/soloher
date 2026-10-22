import { useEffect } from 'react'

export type LegalDoc = 'privacy' | 'terms' | 'age'

interface LegalSection {
  heading: string
  body: string[]
}

const LEGAL_DOCS: Record<LegalDoc, { title: string; intro: string; sections: LegalSection[] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This policy explains what we collect and how we use it.',
    sections: [
      {
        heading: 'What we collect',
        body: ['Your name, email, shipping address and order details, plus basic site usage data such as pages visited and device type.'],
      },
      {
        heading: 'How we use it',
        body: ['To deliver your orders, manage your subscription, confirm your age and send updates. Marketing emails are optional and you can unsubscribe at any time.'],
      },
      {
        heading: 'Sharing',
        body: ['We share information only with service providers that help run SoloHer (payments, shipping, email), or when required by law. We do not sell your personal information.'],
      },
      {
        heading: 'Your choices',
        body: ['To access, correct or delete your information, contact us through Contact Us.'],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'By using this site or placing an order, you agree to these terms.',
    sections: [
      {
        heading: 'Eligibility',
        body: ['You must be 21 or older to use this site or buy from SoloHer.'],
      },
      {
        heading: 'Orders and subscriptions',
        body: ['Subscriptions renew monthly until you cancel. Cancel before your next billing date to avoid the next charge. One-time gifts are charged once. Prices and items may change.'],
      },
      {
        heading: 'Shipping, returns and refunds',
        body: ['We ship only where alcohol delivery is legal, and an adult 21+ must show ID to receive it. Refunds are not offered once a box is delivered. If there is an issue with your box, contact support and we will work with you to make it right.'],
      },
      {
        heading: 'Content and enjoyment',
        body: ['Stories are for your personal use and may not be copied or resold. Please drink responsibly.'],
      },
    ],
  },
  age: {
    title: 'Age Verification',
    intro: 'SoloHer boxes contain alcohol and are for adults 21 and older.',
    sections: [
      {
        heading: 'How we verify',
        body: ['Visitors confirm they are 21+ before entering the site, and an adult 21+ must show valid photo ID on delivery. We may cancel any order if we cannot verify age. Gift recipients must also be 21+.'],
      },
    ],
  },
}

interface LegalModalProps {
  doc: LegalDoc
  onClose: () => void
}

export default function LegalModal({ doc, onClose }: LegalModalProps) {
  const { title, intro, sections } = LEGAL_DOCS[doc]

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
      <div className="modal legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="modal-title" id="legal-title">{title}</h2>
        <p className="modal-subtitle">{intro}</p>

        <div className="legal-body">
          {sections.map(section => (
            <section key={section.heading}>
              <h3>{section.heading}</h3>
              {section.body.map((para, i) => <p key={i}>{para}</p>)}
            </section>
          ))}
        </div>

        <button className="btn-primary legal-done" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
