import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import AISearch from './AISearch'
import './Navbar.css'

// Add wrapper styles
const wrapperStyle = {
  position: 'relative',
  minHeight: '48px',
  width: '100%',
  zIndex: 1000
};


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const menuRef = useRef(null)
  const navbarRef = useRef(null)

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset
    const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10

    if (navbarRef.current) {
      if (isVisible) {
        gsap.to(navbarRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      } else {
        gsap.to(navbarRef.current, {
          y: -navbarRef.current.offsetHeight,
          duration: 0.3,
          ease: 'power2.in'
        })
      }
    }

    setPrevScrollPos(currentScrollPos)
    setVisible(isVisible)
  }, [prevScrollPos])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    // GSAP animation for navbar entrance
    if (navbarRef.current) {
      gsap.fromTo(navbarRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
      )
    }
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isMenuOpen) setIsMenuOpen(false)
    if (!isSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
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
   <div className="navbar-wrapper">
      <nav className="navbar" ref={navbarRef}>
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
          {/* AI Search Bar in Navbar */}
          <div className="nav-search-container">
            <AISearch 
              placeholder="Search cultural heritage..."
              onSearchResults={(query, results) => {
                console.log('AI Search Results:', { query, results });
                // You can add navigation logic here based on search results
              }}
            />
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>

    </nav>
    </div>
  )
}

export default Navbar
