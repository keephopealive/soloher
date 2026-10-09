import { useEffect } from 'react'

export type LegalDoc = 'privacy' | 'terms' | 'age'

interface LegalSection {
  heading: string
  body: string[]
}

const LAST_UPDATED = 'October 8, 2026'

const LEGAL_DOCS: Record<LegalDoc, { title: string; intro: string; sections: LegalSection[] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'Your privacy matters to us. This policy explains what we collect, why we collect it, and the choices you have.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'Information you give us when you order or subscribe, such as your name, email address, shipping address, date of birth and order details.',
          'Payment details are entered directly with our payment processor. We do not store your full card number.',
          'Basic usage information, such as pages visited and device type, collected through cookies and similar tools.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To process and deliver your orders, manage your subscription, verify that you are of legal drinking age, and send order and account updates.',
          'With your permission, to send you news and offers. You can unsubscribe at any time.',
          'To understand how our site is used so we can improve it.',
        ],
      },
      {
        heading: 'Who we share it with',
        body: [
          'Only the service providers who help us run SoloHer, such as payment processors, shipping carriers and email providers, and only for those purposes.',
          'We do not sell your personal information.',
          'We may disclose information when required by law.',
        ],
      },
      {
        heading: 'Discretion',
        body: [
          'Orders ship in plain, unbranded packaging, and billing statements use a discreet descriptor.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          'You can ask to access, correct or delete your personal information, or opt out of marketing emails, by contacting us.',
          'We keep your information only as long as needed for the purposes above or as required by law.',
        ],
      },
      {
        heading: 'Contact',
        body: ['Questions about this policy? Reach us through the Contact Us link at the bottom of the page.'],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'By using this site or placing an order, you agree to these terms. Please read them carefully.',
    sections: [
      {
        heading: 'Eligibility',
        body: [
          'You must be at least 21 years old to use this site or purchase from SoloHer. Our boxes contain alcohol and stories intended for adults.',
        ],
      },
      {
        heading: 'Orders and subscriptions',
        body: [
          'Monthly subscriptions renew automatically and are billed each month until you cancel.',
          'You can cancel at any time. Cancel before your next billing date to avoid being charged for the following month.',
          'One-time purchases are charged once and do not renew.',
          'Prices and box contents may change. Wine and bath bomb selections may be substituted with items of similar style and value when availability requires it.',
        ],
      },
      {
        heading: 'Shipping and delivery',
        body: [
          'We can only ship to locations where alcohol delivery is permitted by law.',
          'An adult aged 21 or older must present a valid government-issued ID and sign for the delivery. Packages cannot be left unattended.',
        ],
      },
      {
        heading: 'Returns',
        body: [
          'For safety and legal reasons, alcohol cannot be returned. If your box arrives damaged or incorrect, contact us and we will make it right.',
        ],
      },
      {
        heading: 'Our content',
        body: [
          'The stories included in each box are original works for your personal enjoyment. They may not be copied, shared or resold.',
        ],
      },
      {
        heading: 'Responsible enjoyment',
        body: [
          'Please drink responsibly. Never drink and drive, and do not combine alcohol with bathing in a way that puts your safety at risk.',
        ],
      },
      {
        heading: 'Changes to these terms',
        body: [
          'We may update these terms from time to time. The date above shows when they last changed. Continuing to use the site means you accept the updated terms.',
        ],
      },
    ],
  },
  age: {
    title: 'Age Verification',
    intro: 'SoloHer boxes contain alcohol, so every purchase is limited to adults aged 21 and older.',
    sections: [
      {
        heading: 'When you visit',
        body: [
          'We ask every visitor to confirm they are 21 or older before entering the site.',
        ],
      },
      {
        heading: 'When you order',
        body: [
          'We ask for your date of birth at checkout and may use a third-party service to verify your age.',
          'We may cancel any order if we are unable to verify that the purchaser is 21 or older.',
        ],
      },
      {
        heading: 'When your box arrives',
        body: [
          'An adult aged 21 or older must show a valid government-issued photo ID and sign for the package.',
          'If no eligible adult is available, the carrier will not leave the box and will attempt redelivery or hold it for pickup.',
        ],
      },
      {
        heading: 'Gifts',
        body: [
          'If you send a box as a gift, the recipient must also be 21 or older and present ID on delivery.',
        ],
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

        <span className="gold-label modal-gold-label">Last updated {LAST_UPDATED}</span>
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
