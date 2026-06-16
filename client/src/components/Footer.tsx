interface FooterProps {
  onSubscribeClick: () => void
}

export default function Footer({ onSubscribeClick }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-cta-row">
        <div className="footer-cta-copy">
          <h3>Your ritual is one click away.</h3>
          <p>Join thousands of women who've made their evenings their own.</p>
        </div>
        <button className="btn-primary" onClick={onSubscribeClick}>
          Start My Ritual — $99.99/mo
        </button>
      </div>

      <div className="footer-top">
        <div>
          <div className="footer-wordmark">
            <span className="wordmark-solo">Solo</span><span className="wordmark-her">Her</span>
          </div>
          <p className="footer-tagline">
            Curated rituals for women who know the evening belongs to them.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#boxes" onClick={e => { e.preventDefault(); document.getElementById('boxes')?.scrollIntoView({ behavior: 'smooth' }) }}>Our Boxes</a></li>
              <li><a href="#how" onClick={e => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }) }}>How It Works</a></li>
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
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Age Verification</a>
        </div>
      </div>
    </footer>
  )
}
