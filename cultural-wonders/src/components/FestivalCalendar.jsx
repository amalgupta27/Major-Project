import React, { useState, useEffect } from 'react';
import { generateFestivalRecommendations } from '../services/aiRecommendations';
import AIButton from './AIButton';
import AIResponse from './AIResponse';
import './FestivalCalendar.css';

const FestivalCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [festivals, setFestivals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  useEffect(() => {
    // Set current month as default
    setSelectedMonth(currentMonth);
  }, [currentMonth]);

  const handleMonthSelect = async (month) => {
    setSelectedMonth(month);
    setIsLoading(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const monthFestivals = generateFestivalRecommendations(month);
      setFestivals(monthFestivals);
    } catch (error) {
      console.error('Error loading festivals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthColor = (month) => {
    const colors = {
      'January': '#FF6B6B',
      'February': '#4ECDC4',
      'March': '#45B7D1',
      'April': '#96CEB4',
      'May': '#FFEAA7',
      'June': '#DDA0DD',
      'July': '#98D8C8',
      'August': '#F7DC6F',
      'September': '#BB8FCE',
      'October': '#85C1E9',
      'November': '#F8C471',
      'December': '#82E0AA'
    };
    return colors[month] || '#FFD700';
  };

  const getFestivalIcon = (festivalName) => {
    const icons = {
      'Diwali': '🪔',
      'Holi': '🎨',
      'Onam': '🌾',
      'Durga Puja': '🕉️',
      'Raksha Bandhan': '🧵',
      'Krishna Janmashtami': '🕉️',
      'Ganesh Chaturthi': '🐘',
      'Navratri': '🕉️',
      'Dussehra': '⚔️',
      'Christmas': '🎄',
      'New Year': '🎊',
      'Makar Sankranti': '☀️',
      'Pongal': '🌾',
      'Lohri': '🔥',
      'Maha Shivaratri': '🕉️',
      'Vasant Panchami': '🌸',
      'Ugadi': '🌱',
      'Ram Navami': '🕉️',
      'Baisakhi': '🌾',
      'Akshaya Tritiya': '💰',
      'Buddha Purnima': '🕉️',
      'Rath Yatra': '🚗',
      'Guru Purnima': '📚',
      'Guru Nanak Jayanti': '🕉️'
    };
    
    // Try to find icon by partial match
    for (const [name, icon] of Object.entries(icons)) {
      if (festivalName.toLowerCase().includes(name.toLowerCase()) || 
          name.toLowerCase().includes(festivalName.toLowerCase())) {
        return icon;
      }
    }
    
    return '🎉'; // Default festival icon
  };

  return (
    <div className="festival-calendar">
      <div className="calendar-header">
        <h2>📅 AI Festival Calendar</h2>
        <p>Discover festivals across India by month</p>
        <AIButton
          onClick={() => setShowCalendar(!showCalendar)}
          variant="primary"
          size="medium"
          icon="📅"
        >
          {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </AIButton>
      </div>

      {showCalendar && (
        <div className="calendar-content">
          <div className="month-selector">
            <h3>Select a Month</h3>
            <div className="month-grid">
              {months.map((month) => (
                <button
                  key={month}
                  className={`month-btn ${selectedMonth === month ? 'selected' : ''}`}
                  style={{
                    backgroundColor: selectedMonth === month ? getMonthColor(month) : '#f5f5f5',
                    color: selectedMonth === month ? '#fff' : '#333'
                  }}
                  onClick={() => handleMonthSelect(month)}
                  disabled={isLoading}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {selectedMonth && (
            <div className="festivals-section">
              <div className="section-header">
                <h3>🎊 Festivals in {selectedMonth}</h3>
                {isLoading && (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    <span>AI is curating festivals...</span>
                  </div>
                )}
              </div>

              {!isLoading && festivals.length > 0 && (
                <div className="festivals-grid">
                  {festivals.map((festival, index) => (
                    <div
                      key={index}
                      className="festival-card"
                      style={{ borderLeftColor: getMonthColor(selectedMonth) }}
                    >
                      <div className="festival-header">
                        <div className="festival-icon">
                          {getFestivalIcon(festival.name)}
                        </div>
                        <div className="festival-info">
                          <h4>{festival.name}</h4>
                          <p className="festival-states">
                            {Array.isArray(festival.states) 
                              ? festival.states.join(', ') 
                              : festival.states}
                          </p>
                        </div>
                      </div>
                      <div className="festival-description">
                        {festival.description}
                      </div>
                      <div className="festival-actions">
                        <AIButton
                          variant="secondary"
                          size="small"
                          icon="📖"
                          onClick={() => {
                            // Generate story about this festival
                            console.log('Generate festival story:', festival);
                          }}
                        >
                          Learn More
                        </AIButton>
                        <AIButton
                          variant="accent"
                          size="small"
                          icon="🗺️"
                          onClick={() => {
                            // Show on map or navigate to state
                            console.log('Show festival location:', festival);
                          }}
                        >
                          Explore
                        </AIButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && festivals.length === 0 && (
                <div className="no-festivals">
                  <p>No festivals found for {selectedMonth}. Try selecting a different month!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FestivalCalendar;
