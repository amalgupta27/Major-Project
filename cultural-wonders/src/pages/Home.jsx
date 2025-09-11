import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import PersonalizedRecommendations from '../components/PersonalizedRecommendations'
import FestivalCalendar from '../components/FestivalCalendar'
import VoiceInteraction from '../components/VoiceInteraction'
import './Home.css'

const Home = () => {
  const heroRef = useRef(null)
  const highlightsRef = useRef(null)
  const featuresRef = useRef(null)
  const recommendationsRef = useRef(null)
  const festivalRef = useRef(null)
  const voiceRef = useRef(null)

  useEffect(() => {
    // GSAP animations for page elements
    const tl = gsap.timeline()
    
    tl.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )
    .fromTo('.hero-title', 
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo('.hero-subtitle', 
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo('.hero-cta', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.3'
    )
    .fromTo(highlightsRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo(featuresRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo(recommendationsRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo(festivalRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo(voiceRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
  }, [])

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Discover the Hidden Gems of
            <span className="highlight"> Indian Culture</span>
          </h1>
          <p className="hero-subtitle">
            Journey through lesser-known traditions, folk arts, ancient crafts, 
            and regional cuisines that make India truly extraordinary
          </p>
          <div className="hero-cta">
            <Link to="/heritage" className="cta-primary">
              Explore Heritage
            </Link>
            <Link to="/quiz" className="cta-secondary">
              🎯 Take Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Cultural Highlights */}
      <section className="highlights" ref={highlightsRef}>
        <div className="container">
          <h2 className="section-title">Cultural Highlights</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">🏺</div>
              <h3>Ancient Crafts</h3>
              <p>Discover traditional pottery, weaving, and metalwork techniques passed down through generations.</p>
              <Link to="/crafts" className="highlight-link">Learn More →</Link>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🎭</div>
              <h3>Folk Arts</h3>
              <p>Experience the vibrant world of traditional dance, music, and storytelling from different regions.</p>
              <Link to="/arts" className="highlight-link">Learn More →</Link>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🍽️</div>
              <h3>Regional Cuisines</h3>
              <p>Taste the diverse flavors and cooking methods that define India's culinary heritage.</p>
              <Link to="/cuisines" className="highlight-link">Learn More →</Link>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🎊</div>
              <h3>Festivals & Celebrations</h3>
              <p>Immerse yourself in the colorful traditions and rituals that bring communities together.</p>
              <Link to="/festivals" className="highlight-link">Learn More →</Link>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🗺️</div>
              <h3>State by State</h3>
              <p>Explore the unique cultural heritage of all 28 Indian states and union territories.</p>
              <Link to="/states" className="highlight-link">Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featuresRef}>
        <div className="container">
          <h2 className="section-title">Why Explore With Us?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <h3>Authentic Information</h3>
              <p>Curated content from cultural experts and local communities</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">02</div>
              <h3>Interactive Learning</h3>
              <p>Engage with quizzes, stories, and multimedia content</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">03</div>
              <h3>Hidden Treasures</h3>
              <p>Discover lesser-known aspects beyond famous landmarks</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">04</div>
              <h3>Cultural Preservation</h3>
              <p>Supporting the documentation and celebration of traditions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations Section */}
      <section className="recommendations-section" ref={recommendationsRef}>
        <div className="container">
          <PersonalizedRecommendations />
        </div>
      </section>

      {/* Festival Calendar Section */}
      <section className="festival-section" ref={festivalRef}>
        <div className="container">
          <FestivalCalendar />
        </div>
      </section>

      {/* Voice Interaction Section */}
      <section className="voice-section" ref={voiceRef}>
        <div className="container">
          <VoiceInteraction />
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Begin Your Cultural Journey?</h2>
            <p>Start exploring the rich tapestry of Indian heritage today</p>
            <div className="cta-buttons">
              <Link to="/heritage" className="cta-btn-primary">
                Start Exploring
              </Link>
              <Link to="/states" className="cta-btn-secondary">
                Explore States
              </Link>
              <Link to="/quiz" className="cta-btn-secondary">
                Test Your Knowledge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
