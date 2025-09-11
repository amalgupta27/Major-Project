import { useEffect } from 'react'
import { gsap } from 'gsap'
import './Footer.css'

const Footer = () => {
  useEffect(() => {
    // GSAP animation for footer entrance
    gsap.fromTo('.footer', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.5 }
    )
  }, [])

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">🏛️ Cultural Wonders</h3>
            <p className="footer-description">
              Exploring the rich tapestry of Indian heritage, arts, and traditions. 
              Discover the lesser-known gems that make India truly incredible.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/heritage">Heritage Sites</a></li>
              <li><a href="/arts">Folk Arts</a></li>
              <li><a href="/festivals">Festivals</a></li>
              <li><a href="/cuisines">Regional Cuisines</a></li>
              <li><a href="/crafts">Traditional Crafts</a></li>
              <li><a href="/quiz">🎯 Take Quiz</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Connect With Us</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                📘 Facebook
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                🐦 Twitter
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                📷 Instagram
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                📺 YouTube
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Newsletter</h4>
            <p>Stay updated with cultural discoveries!</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Cultural Wonders. All rights reserved.</p>
            <p>Made with ❤️ for preserving Indian heritage</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
