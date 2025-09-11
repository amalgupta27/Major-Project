import React, { useState, useEffect } from 'react';
import { generateAIRecommendations } from '../services/aiRecommendations';
import { getUserEngagementScore } from '../services/userPreferences';
import AIButton from './AIButton';
import AIResponse from './AIResponse';
import './PersonalizedRecommendations.css';

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [engagementScore, setEngagementScore] = useState(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const recs = await generateAIRecommendations();
      setRecommendations(recs);
      
      const score = getUserEngagementScore();
      setEngagementScore(score);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationClick = (recommendation) => {
    setExpandedRecommendation(
      expandedRecommendation?.id === recommendation.id ? null : recommendation
    );
  };

  const getRecommendationIcon = (type) => {
    const icons = {
      'interest-based': '🎯',
      'state-based': '🗺️',
      'ai-powered': '🤖',
      'fallback': '⭐'
    };
    return icons[type] || '💡';
  };

  const getRecommendationColor = (type) => {
    const colors = {
      'interest-based': '#FF9933',
      'state-based': '#006994',
      'ai-powered': '#800000',
      'fallback': '#8B4513'
    };
    return colors[type] || '#8B4513';
  };

  if (isLoading) {
    return (
      <div className="personalized-recommendations">
        <div className="recommendations-header">
          <h2>🎯 Recommended for You</h2>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Generating personalized recommendations...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="personalized-recommendations">
      <div className="recommendations-header">
        <h2>🎯 Recommended for You</h2>
        {engagementScore && (
          <div className="engagement-badge">
            <span className="engagement-level">{engagementScore.level}</span>
            <span className="engagement-score">{engagementScore.score}/100</span>
          </div>
        )}
        <AIButton
          onClick={loadRecommendations}
          variant="ghost"
          size="small"
          icon="🔄"
          className="refresh-btn"
        >
          Refresh
        </AIButton>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`recommendation-card ${expandedRecommendation?.id === recommendation.id ? 'expanded' : ''}`}
            style={{ borderLeftColor: getRecommendationColor(recommendation.type) }}
            onClick={() => handleRecommendationClick(recommendation)}
          >
            <div className="recommendation-header">
              <div className="recommendation-icon">
                {getRecommendationIcon(recommendation.type)}
              </div>
              <div className="recommendation-content">
                <h3>{recommendation.title}</h3>
                <p className="recommendation-reason">{recommendation.reason}</p>
              </div>
              <div className="expand-indicator">
                {expandedRecommendation?.id === recommendation.id ? '−' : '+'}
              </div>
            </div>

            <div className="recommendation-description">
              {recommendation.description}
            </div>

            {expandedRecommendation?.id === recommendation.id && (
              <div className="recommendation-details">
                {recommendation.type === 'ai-powered' ? (
                  <AIResponse
                    content={recommendation.description}
                    type="search"
                    icon="🤖"
                  />
                ) : (
                  <div className="detailed-content">
                    <div className="content-info">
                      <h4>{recommendation.content.title}</h4>
                      <p><strong>Location:</strong> {recommendation.content.state}</p>
                      <p><strong>Description:</strong> {recommendation.content.description}</p>
                    </div>
                    <div className="action-buttons">
                      <AIButton
                        variant="primary"
                        size="small"
                        icon="🔍"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to relevant page
                          console.log('Explore:', recommendation.content);
                        }}
                      >
                        Explore
                      </AIButton>
                      <AIButton
                        variant="secondary"
                        size="small"
                        icon="📖"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Generate story about this content
                          console.log('Generate story:', recommendation.content);
                        }}
                      >
                        Learn More
                      </AIButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="no-recommendations">
          <p>Start exploring to get personalized recommendations!</p>
          <AIButton
            onClick={() => window.location.href = '/states'}
            variant="primary"
            size="medium"
            icon="🗺️"
          >
            Explore States
          </AIButton>
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
