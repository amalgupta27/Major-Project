import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import AISearch from './AISearch'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    // GSAP animation for navbar entrance
    gsap.fromTo('.navbar', 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    )
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isSearchOpen) setIsSearchOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isMenuOpen) setIsMenuOpen(false)
    if (!isSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or filter states
      navigate(`/states?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">🏛️ Cultural Wonders</span>
        </Link>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`} ref={menuRef}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/heritage" 
            className={`nav-link ${isActive('/heritage') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Heritage
          </Link>
          <Link 
            to="/arts" 
            className={`nav-link ${isActive('/arts') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Arts
          </Link>
          <Link 
            to="/festivals" 
            className={`nav-link ${isActive('/festivals') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Festivals
          </Link>
          <Link 
            to="/cuisines" 
            className={`nav-link ${isActive('/cuisines') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Cuisines
          </Link>
          <Link 
            to="/crafts" 
            className={`nav-link ${isActive('/crafts') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Crafts
          </Link>
          <Link 
            to="/states" 
            className={`nav-link ${isActive('/states') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            States
          </Link>
          <Link 
            to="/quiz" 
            className={`nav-link quiz-link ${isActive('/quiz') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            🎯 Quiz
          </Link>
          <Link 
            to="/chat" 
            className={`nav-link chat-link ${isActive('/chat') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            💬 AI Chat
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
        </div>

        <div className="navbar-actions">
          {/* Search Button */}
          <button 
            className={`search-toggle ${isSearchOpen ? 'active' : ''}`}
            onClick={toggleSearch}
            aria-label="Toggle search"
          >
            🔍
          </button>

          {/* Mobile Menu Toggle */}
          <div className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        {/* AI Search Bar */}
        <div className={`search-container ${isSearchOpen ? 'active' : ''}`}>
          <AISearch 
            placeholder="Ask AI about cultural heritage..."
            onSearchResults={(query, results) => {
              console.log('AI Search Results:', { query, results });
              // You can add navigation logic here based on search results
            }}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
