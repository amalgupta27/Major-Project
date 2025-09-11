import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { culturalData } from '../data/culturalData'
import './Crafts.css'

const Crafts = () => {
  const headerRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    tl.fromTo(headerRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )
    .fromTo(cardsRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5'
    )
  }, [])

  return (
    <div className="crafts">
      <div className="crafts-header" ref={headerRef}>
        <div className="container">
          <h1>⚜️ Traditional Crafts</h1>
          <p>Explore the ancient techniques and artistic traditions of Indian craftsmanship</p>
        </div>
      </div>

      <div className="crafts-content">
        <div className="container">
          <div className="crafts-grid" ref={cardsRef}>
            {culturalData.crafts.map((craft, index) => (
              <div key={craft.id} className="craft-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="craft-icon">{craft.image}</div>
                <div className="craft-content">
                  <h3>{craft.name}</h3>
                  <span className="craft-location">📍 {craft.location}</span>
                  <span className="craft-category">{craft.category}</span>
                  <p className="craft-description">{craft.description}</p>
                  <div className="craft-technique">
                    <strong>Technique:</strong> {craft.technique}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Crafts
