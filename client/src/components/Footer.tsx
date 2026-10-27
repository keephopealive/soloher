import type { LegalDoc } from './LegalModal'
import logoFull from '../assets/logo-full.webp'
import { NAV_LINKS } from './Navbar'
import { openFaq } from './FAQ'

interface FooterProps {
  onOpenLegal: (doc: LegalDoc) => void
  onAccountClick: () => void
}

export default function Footer({ onOpenLegal, onAccountClick }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <img className="footer-logo" src={logoFull} alt="SoloHer" width={640} height={661} />
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              {/* Contact is already under Support as "Contact Us" */}
              {NAV_LINKS.filter(l => l.id !== 'contact').map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>Contact Us</a></li>
              <li><a href="#faq-delivery" onClick={e => { e.preventDefault(); openFaq('delivery') }}>Shipping Info</a></li>
              <li><a href="#faq-refunds" onClick={e => { e.preventDefault(); openFaq('refunds') }}>Returns/Exchanges</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); onAccountClick() }}>My Account</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Follow</h4>
            <ul>
              <li><a href="https://www.instagram.com/soloherbox/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@soloherbox" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© {new Date().getFullYear()} SoloHer. All rights reserved.</p>
        <div className="footer-legal">
          <button onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>
          <button onClick={() => onOpenLegal('terms')}>Terms of Service</button>
          <button onClick={() => onOpenLegal('age')}>Age Verification</button>
        </div>
      </div>
    </footer>
  )
}
