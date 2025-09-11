import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { culturalData } from '../data/culturalData'
import './Cuisines.css'

const Cuisines = () => {
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
    <div className="cuisines">
      <div className="cuisines-header" ref={headerRef}>
        <div className="container">
          <h1>🍽️ Regional Cuisines</h1>
          <p>Discover the diverse flavors and cooking traditions of India</p>
        </div>
      </div>

      <div className="cuisines-content">
        <div className="container">
          <div className="cuisines-grid" ref={cardsRef}>
            {culturalData.cuisines.map((cuisine, index) => (
              <div key={cuisine.id} className="cuisine-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="cuisine-icon">{cuisine.image}</div>
                <div className="cuisine-content">
                  <h3>{cuisine.name}</h3>
                  <span className="cuisine-location">📍 {cuisine.location}</span>
                  <span className="cuisine-category">{cuisine.category}</span>
                  <p className="cuisine-description">{cuisine.description}</p>
                  <div className="cuisine-specialties">
                    <strong>Specialties:</strong>
                    <ul>
                      {cuisine.specialties.map((specialty, idx) => (
                        <li key={idx}>{specialty}</li>
                      ))}
                    </ul>
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

export default Cuisines
