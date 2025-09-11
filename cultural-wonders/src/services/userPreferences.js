// User Preferences Service - handles AI personalization and user interest tracking

const STORAGE_KEY = 'cultural_heritage_preferences';

// Default user preferences
const defaultPreferences = {
  interests: {
    art: 0,
    dance: 0,
    history: 0,
    food: 0,
    architecture: 0,
    festivals: 0,
    crafts: 0,
    music: 0
  },
  visitedStates: [],
  viewedContent: [],
  searchHistory: [],
  lastUpdated: new Date().toISOString()
};

// Load user preferences from localStorage
export function loadUserPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const preferences = JSON.parse(stored);
      // Merge with defaults to handle new interest categories
      return {
        ...defaultPreferences,
        ...preferences,
        interests: {
          ...defaultPreferences.interests,
          ...preferences.interests
        }
      };
    }
  } catch (error) {
    console.error('Error loading user preferences:', error);
  }
  return defaultPreferences;
}

// Save user preferences to localStorage
export function saveUserPreferences(preferences) {
  try {
    preferences.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
}

// Track user interest based on content interaction
export function trackUserInterest(contentType, contentData) {
  const preferences = loadUserPreferences();
  
  // Map content types to interest categories
  const interestMapping = {
    'heritage': 'history',
    'arts': 'art',
    'dance': 'dance',
    'cuisines': 'food',
    'festivals': 'festivals',
    'crafts': 'crafts',
    'architecture': 'architecture',
    'music': 'music'
  };
  
  const interestCategory = interestMapping[contentType] || 'history';
  
  // Increase interest score
  preferences.interests[interestCategory] = Math.min(
    preferences.interests[interestCategory] + 1,
    10 // Max score of 10
  );
  
  // Track visited states
  if (contentData.state && !preferences.visitedStates.includes(contentData.state)) {
    preferences.visitedStates.push(contentData.state);
  }
  
  // Track viewed content
  const contentEntry = {
    type: contentType,
    data: contentData,
    timestamp: new Date().toISOString()
  };
  
  preferences.viewedContent.unshift(contentEntry);
  // Keep only last 20 viewed items
  preferences.viewedContent = preferences.viewedContent.slice(0, 20);
  
  saveUserPreferences(preferences);
  return preferences;
}

// Track search queries
export function trackSearchQuery(query) {
  const preferences = loadUserPreferences();
  
  preferences.searchHistory.unshift({
    query,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 10 searches
  preferences.searchHistory = preferences.searchHistory.slice(0, 10);
  
  saveUserPreferences(preferences);
  return preferences;
}

// Get user's top interests
export function getTopInterests(limit = 3) {
  const preferences = loadUserPreferences();
  
  return Object.entries(preferences.interests)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([interest, score]) => ({ interest, score }));
}

// Get personalized recommendations based on user interests
export function getPersonalizedRecommendations() {
  const preferences = loadUserPreferences();
  const topInterests = getTopInterests(3);
  
  const recommendations = [];
  
  // Generate recommendations based on top interests
  topInterests.forEach(({ interest, score }) => {
    if (score > 0) {
      recommendations.push({
        type: 'interest',
        interest,
        score,
        message: `Based on your interest in ${interest}, you might enjoy exploring more ${interest}-related content.`
      });
    }
  });
  
  // Generate state-based recommendations
  if (preferences.visitedStates.length > 0) {
    const lastVisitedState = preferences.visitedStates[preferences.visitedStates.length - 1];
    recommendations.push({
      type: 'state',
      state: lastVisitedState,
      message: `Since you explored ${lastVisitedState}, you might also enjoy similar cultural experiences in neighboring states.`
    });
  }
  
  // Generate content-based recommendations
  if (preferences.viewedContent.length > 0) {
    const recentContent = preferences.viewedContent.slice(0, 3);
    recommendations.push({
      type: 'content',
      content: recentContent,
      message: `Based on your recent exploration, here are some related cultural treasures you might find fascinating.`
    });
  }
  
  return recommendations;
}

// Reset user preferences
export function resetUserPreferences() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultPreferences;
}

// Get user engagement score
export function getUserEngagementScore() {
  const preferences = loadUserPreferences();
  
  const totalInterestScore = Object.values(preferences.interests).reduce((sum, score) => sum + score, 0);
  const contentViews = preferences.viewedContent.length;
  const statesVisited = preferences.visitedStates.length;
  const searchesPerformed = preferences.searchHistory.length;
  
  // Calculate engagement score (0-100)
  const engagementScore = Math.min(
    (totalInterestScore * 2) + (contentViews * 3) + (statesVisited * 5) + (searchesPerformed * 2),
    100
  );
  
  return {
    score: engagementScore,
    level: engagementScore >= 80 ? 'Expert' : 
           engagementScore >= 60 ? 'Enthusiast' : 
           engagementScore >= 40 ? 'Explorer' : 
           engagementScore >= 20 ? 'Beginner' : 'Newcomer',
    breakdown: {
      totalInterestScore,
      contentViews,
      statesVisited,
      searchesPerformed
    }
  };
}
