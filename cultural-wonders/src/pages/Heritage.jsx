import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { culturalData } from '../data/culturalData'
import { generateCulturalStory } from '../services/aiService'
import { trackUserInterest } from '../services/userPreferences'
import AIButton from '../components/AIButton'
import AIResponse from '../components/AIResponse'
import './Heritage.css'

const Heritage = () => {
  const headerRef = useRef(null)
  const cardsRef = useRef(null)
  const [stories, setStories] = useState({})
  const [loadingStories, setLoadingStories] = useState({})

  useEffect(() => {
    // GSAP animations for page elements
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

  const handleGenerateStory = async (site) => {
    const siteId = site.id
    if (loadingStories[siteId]) return
    
    setLoadingStories(prev => ({ ...prev, [siteId]: true }))
    try {
      const context = `Location: ${site.location}, Category: ${site.category}, Significance: ${site.significance}`
      const story = await generateCulturalStory(site.name, context)
      setStories(prev => ({ ...prev, [siteId]: story }))
      
      // Track user interest in heritage/history
      trackUserInterest('heritage', {
        name: site.name,
        location: site.location,
        category: site.category
      })
    } catch (error) {
      console.error('Error generating story:', error)
      setStories(prev => ({ 
        ...prev, 
        [siteId]: 'Sorry, I couldn\'t generate a story right now. Please try again!' 
      }))
    } finally {
      setLoadingStories(prev => ({ ...prev, [siteId]: false }))
    }
  }

  return (
    <div className="heritage">
      <div className="heritage-header" ref={headerRef}>
        <div className="container">
          <h1>🏛️ Cultural Heritage Sites</h1>
          <p>Discover the lesser-known architectural marvels and historical treasures of India</p>
        </div>
      </div>

      <div className="heritage-content">
        <div className="container">
          <div className="heritage-grid" ref={cardsRef}>
            {culturalData.heritage.map((site, index) => (
              <div key={site.id} className="heritage-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-header">
                  <div className="site-icon">{site.image}</div>
                  <div className="site-info">
                    <h3>{site.name}</h3>
                    <span className="location">📍 {site.location}</span>
                    <span className="category">{site.category}</span>
                  </div>
                </div>
                
                <div className="card-body">
                  <p className="description">{site.description}</p>
                  <div className="significance">
                    <strong>Significance:</strong> {site.significance}
                  </div>
                  
                  <div className="ai-story-section">
                    <AIButton
                      onClick={() => handleGenerateStory(site)}
                      variant="accent"
                      size="small"
                      icon="📖"
                      loading={loadingStories[site.id]}
                    >
                      Generate a story
                    </AIButton>
                    
                    {stories[site.id] && (
                      <AIResponse
                        content={stories[site.id]}
                        type="story"
                        icon="📖"
                      />
                    )}
                  </div>
                </div>
                
                <div className="card-footer">
                  <button className="learn-more-btn">
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Heritage
