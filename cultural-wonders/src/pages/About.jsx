import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './About.css'

const About = () => {
  const headerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    tl.fromTo(headerRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )
    .fromTo(contentRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
  }, [])

  return (
    <div className="about">
      <div className="about-header" ref={headerRef}>
        <div className="container">
          <h1>🏛️ About Cultural Wonders</h1>
          <p>Preserving and celebrating the rich tapestry of Indian heritage</p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          <div className="about-grid" ref={contentRef}>
            <div className="about-section">
              <h2>Our Mission</h2>
              <p>
                Cultural Wonders is dedicated to preserving and promoting the diverse cultural heritage of India. 
                We believe that every tradition, art form, and cultural practice tells a unique story that deserves 
                to be shared and celebrated.
              </p>
            </div>

            <div className="about-section">
              <h2>What We Do</h2>
              <ul>
                <li>Document lesser-known cultural traditions and practices</li>
                <li>Showcase traditional arts, crafts, and cuisines</li>
                <li>Educate visitors about India's rich heritage</li>
                <li>Provide interactive learning experiences</li>
                <li>Support cultural preservation efforts</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Our Values</h2>
              <div className="values-grid">
                <div className="value-item">
                  <span className="value-icon">🎯</span>
                  <h3>Authenticity</h3>
                  <p>We ensure all information is accurate and authentic</p>
                </div>
                <div className="value-item">
                  <span className="value-icon">🤝</span>
                  <h3>Inclusivity</h3>
                  <p>Celebrating diversity across all regions and communities</p>
                </div>
                <div className="value-item">
                  <span className="value-icon">📚</span>
                  <h3>Education</h3>
                  <p>Making cultural learning accessible and engaging</p>
                </div>
                <div className="value-item">
                  <span className="value-icon">💝</span>
                  <h3>Preservation</h3>
                  <p>Protecting cultural heritage for future generations</p>
                </div>
              </div>
            </div>

            <div className="about-section">
              <h2>Get Involved</h2>
              <p>
                Whether you're a cultural enthusiast, researcher, or simply curious about Indian heritage, 
                there are many ways to get involved with Cultural Wonders. Take our quiz, explore our content, 
                and share your knowledge with others.
              </p>
              <div className="cta-buttons">
                <button className="cta-btn-primary">Take Quiz</button>
                <button className="cta-btn-secondary">Explore Heritage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
