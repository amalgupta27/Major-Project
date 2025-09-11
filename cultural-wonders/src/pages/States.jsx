import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import './States.css'
import { statesData } from '../data/statesData'

const States = () => {
  const headerRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Animate header
    tl.fromTo(headerRef.current, 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    )
    
    // Animate cards with stagger
    tl.fromTo(cardsRef.current.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "-=0.4"
    )
  }, [])

  return (
    <div className="states-page">
      <header className="states-header" ref={headerRef}>
        <h1>Explore Indian States</h1>
        <p>Discover the rich cultural diversity across all 28 states of India</p>
      </header>

      <div className="states-grid" ref={cardsRef}>
        {statesData.map((state) => (
          <div key={state.id} className="state-card">
            <div className="state-image">
              <img src={state.image} alt={state.name} />
            </div>
            <div className="state-content">
              <h3>{state.name}</h3>
              <p>{state.intro}</p>
              <Link to={`/state/${state.id}`} className="explore-btn">
                Explore More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default States
