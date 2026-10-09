import type { LegalDoc } from './LegalModal'
import logoFull from '../assets/logo-full.webp'

interface FooterProps {
  onOpenLegal: (doc: LegalDoc) => void
}

export default function Footer({ onOpenLegal }: FooterProps) {
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
              <li><a href="#boxes" onClick={e => { e.preventDefault(); document.getElementById('boxes')?.scrollIntoView({ behavior: 'smooth' }) }}>Our Boxes</a></li>
              <li><a href="#faq" onClick={e => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) }}>FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">My Account</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Follow</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">Pinterest</a></li>
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
