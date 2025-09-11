import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { culturalData } from '../data/culturalData'
import './Festivals.css'

const Festivals = () => {
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
    <div className="festivals">
      <div className="festivals-header" ref={headerRef}>
        <div className="container">
          <h1>🎊 Festivals & Celebrations</h1>
          <p>Experience the vibrant colors and rich traditions of Indian festivals</p>
        </div>
      </div>

      <div className="festivals-content">
        <div className="container">
          <div className="festivals-grid" ref={cardsRef}>
            {culturalData.festivals.map((festival, index) => (
              <div key={festival.id} className="festival-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="festival-icon">{festival.image}</div>
                <div className="festival-content">
                  <h3>{festival.name}</h3>
                  <span className="festival-location">📍 {festival.location}</span>
                  <span className="festival-category">{festival.category}</span>
                  <span className="festival-month">📅 {festival.month}</span>
                  <p className="festival-description">{festival.description}</p>
                  <div className="festival-significance">
                    <strong>Significance:</strong> {festival.significance}
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

export default Festivals
