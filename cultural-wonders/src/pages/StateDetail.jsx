import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { getStateById } from '../data/statesData'
import { generateTravelItinerary } from '../services/aiService'
import AIButton from '../components/AIButton'
import AIResponse from '../components/AIResponse'
import './StateDetail.css'

const StateDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const [travelItinerary, setTravelItinerary] = useState('')
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false)
  const [showItinerary, setShowItinerary] = useState(false)

  const state = getStateById(id)

  useEffect(() => {
    if (!state) return
    const tl = gsap.timeline()
    tl.fromTo(headerRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' })
      .fromTo(containerRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
  }, [state])

  const handleGenerateTravelGuide = async () => {
    if (isLoadingItinerary || !state) return
    
    setIsLoadingItinerary(true)
    try {
      const itinerary = await generateTravelItinerary(state.name, 5)
      setTravelItinerary(itinerary)
      setShowItinerary(true)
    } catch (error) {
      console.error('Error generating travel guide:', error)
      setTravelItinerary('Sorry, I couldn\'t generate a travel guide right now. Please try again!')
      setShowItinerary(true)
    } finally {
      setIsLoadingItinerary(false)
    }
  }

  if (!state) {
    return (
      <div className="state-detail not-found">
        <div className="container">
          <h2>State not found</h2>
          <button onClick={() => navigate('/states')} className="back-btn">Back to States</button>
        </div>
      </div>
    )
  }

  return (
    <div className="state-detail">
      <header className="detail-header" ref={headerRef}>
        <div className="container">
          <Link to="/states" className="back-link">← Back to States</Link>
          <h1>{state.name}</h1>
          <p>{state.intro}</p>
        </div>
      </header>

      <div className="container detail-content" ref={containerRef}>
        <div className="detail-hero">
          <img src={state.image} alt={state.name} />
        </div>

        <section className="detail-section">
          <h2>About {state.name}</h2>
          <p>
            {state.name} is rich in cultural traditions, heritage, and natural beauty. This page will be
            expanded with more content: famous festivals, classical arts, crafts, cuisines, and lesser-known
            cultural highlights unique to {state.name}.
          </p>
        </section>

        <section className="detail-section travel-guide-section">
          <div className="section-header">
            <h2>🗺️ Cultural Travel Guide</h2>
            <AIButton
              onClick={handleGenerateTravelGuide}
              variant="primary"
              size="medium"
              icon="🗺️"
              loading={isLoadingItinerary}
            >
              Plan a cultural trip
            </AIButton>
          </div>
          
          {showItinerary && (
            <AIResponse
              content={travelItinerary}
              type="travel"
              icon="🗺️"
            />
          )}
        </section>

        <section className="detail-section">
          <h3>Highlights</h3>
          <ul className="detail-list">
            <li>Festivals and celebrations specific to the region</li>
            <li>Traditional art and craft forms</li>
            <li>Local cuisines and specialties</li>
            <li>Heritage sites and hidden gems</li>
          </ul>
        </section>

        <div className="detail-actions">
          <Link to="/quiz" className="action-btn primary">🎯 Take Quiz</Link>
          <Link to="/heritage" className="action-btn">Explore Heritage</Link>
        </div>
      </div>
    </div>
  )
}

export default StateDetail
