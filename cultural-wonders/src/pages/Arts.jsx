import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { culturalData } from '../data/culturalData'
import './Arts.css'

const Arts = () => {
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
    <div className="arts">
      <div className="arts-header" ref={headerRef}>
        <div className="container">
          <h1>🎨 Traditional Arts & Crafts</h1>
          <p>Explore the vibrant world of Indian folk arts, tribal paintings, and traditional crafts</p>
        </div>
      </div>

      <div className="arts-content">
        <div className="container">
          <div className="arts-grid" ref={cardsRef}>
            {culturalData.arts.map((art, index) => (
              <div key={art.id} className="art-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="art-icon">{art.image}</div>
                <div className="art-content">
                  <h3>{art.name}</h3>
                  <span className="art-location">📍 {art.location}</span>
                  <span className="art-category">{art.category}</span>
                  <p className="art-description">{art.description}</p>
                  <div className="art-technique">
                    <strong>Technique:</strong> {art.technique}
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

export default Arts
