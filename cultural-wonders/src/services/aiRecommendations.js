// AI Recommendations Service - generates personalized cultural recommendations

import { performCulturalSearch } from './aiService';
import { getPersonalizedRecommendations, getTopInterests, getUserEngagementScore } from './userPreferences';

// Cultural content database for recommendations
const culturalContent = {
  art: [
    { title: 'Madhubani Paintings', state: 'Bihar', description: 'Traditional folk art with geometric patterns' },
    { title: 'Warli Art', state: 'Maharashtra', description: 'Tribal art depicting daily life and nature' },
    { title: 'Pattachitra', state: 'Odisha', description: 'Traditional cloth-based scroll painting' },
    { title: 'Miniature Paintings', state: 'Rajasthan', description: 'Intricate paintings from the Mughal era' }
  ],
  dance: [
    { title: 'Bharatanatyam', state: 'Tamil Nadu', description: 'Classical dance form with expressive movements' },
    { title: 'Kathak', state: 'Uttar Pradesh', description: 'Story-telling dance with intricate footwork' },
    { title: 'Odissi', state: 'Odisha', description: 'Graceful dance inspired by temple sculptures' },
    { title: 'Kuchipudi', state: 'Andhra Pradesh', description: 'Classical dance-drama tradition' }
  ],
  history: [
    { title: 'Ajanta Caves', state: 'Maharashtra', description: 'Ancient Buddhist cave paintings' },
    { title: 'Hampi', state: 'Karnataka', description: 'Ruins of the Vijayanagara Empire' },
    { title: 'Khajuraho', state: 'Madhya Pradesh', description: 'Temples with intricate sculptures' },
    { title: 'Konark Sun Temple', state: 'Odisha', description: 'Architectural marvel dedicated to Sun God' }
  ],
  food: [
    { title: 'Kerala Cuisine', state: 'Kerala', description: 'Coconut-based dishes and seafood' },
    { title: 'Rajasthani Thali', state: 'Rajasthan', description: 'Rich, spicy flavors of the desert' },
    { title: 'Bengali Sweets', state: 'West Bengal', description: 'Famous rasgulla and sandesh' },
    { title: 'Punjabi Cuisine', state: 'Punjab', description: 'Butter chicken and naan bread' }
  ],
  architecture: [
    { title: 'Taj Mahal', state: 'Uttar Pradesh', description: 'White marble mausoleum' },
    { title: 'Meenakshi Temple', state: 'Tamil Nadu', description: 'Dravidian architecture masterpiece' },
    { title: 'Golden Temple', state: 'Punjab', description: 'Sacred Sikh shrine' },
    { title: 'Lotus Temple', state: 'Delhi', description: 'Modern architectural wonder' }
  ],
  festivals: [
    { title: 'Diwali', states: ['All India'], description: 'Festival of lights' },
    { title: 'Holi', states: ['All India'], description: 'Festival of colors' },
    { title: 'Onam', states: ['Kerala'], description: 'Harvest festival of Kerala' },
    { title: 'Durga Puja', states: ['West Bengal'], description: 'Celebration of Goddess Durga' }
  ],
  crafts: [
    { title: 'Bamboo Crafts', state: 'Assam', description: 'Traditional bamboo products' },
    { title: 'Blue Pottery', state: 'Rajasthan', description: 'Distinctive blue-glazed pottery' },
    { title: 'Pashmina Shawls', state: 'Kashmir', description: 'Luxurious woolen shawls' },
    { title: 'Wood Carving', state: 'Karnataka', description: 'Intricate wooden sculptures' }
  ],
  music: [
    { title: 'Carnatic Music', state: 'Tamil Nadu', description: 'Classical South Indian music' },
    { title: 'Hindustani Music', state: 'North India', description: 'Classical North Indian music' },
    { title: 'Folk Music', state: 'Various', description: 'Traditional regional music forms' },
    { title: 'Bhangra', state: 'Punjab', description: 'Energetic folk dance and music' }
  ]
};

// Generate AI-powered recommendations
export async function generateAIRecommendations() {
  try {
    const userRecommendations = getPersonalizedRecommendations();
    const topInterests = getTopInterests(3);
    const engagementScore = getUserEngagementScore();
    
    const recommendations = [];
    
    // Generate recommendations based on top interests
    for (const { interest, score } of topInterests) {
      if (score > 0 && culturalContent[interest]) {
        const content = culturalContent[interest];
        const randomItem = content[Math.floor(Math.random() * content.length)];
        
        recommendations.push({
          id: `interest-${interest}-${Date.now()}`,
          type: 'interest-based',
          title: `Explore ${interest} in ${randomItem.state}`,
          description: randomItem.description,
          content: randomItem,
          reason: `Based on your interest in ${interest}`,
          priority: score
        });
      }
    }
    
    // Generate state-based recommendations
    if (userRecommendations.some(rec => rec.type === 'state')) {
      const stateRec = userRecommendations.find(rec => rec.type === 'state');
      const relatedStates = getRelatedStates(stateRec.state);
      
      relatedStates.forEach(state => {
        const randomInterest = Object.keys(culturalContent)[Math.floor(Math.random() * Object.keys(culturalContent).length)];
        const content = culturalContent[randomInterest].find(item => item.state === state);
        
        if (content) {
          recommendations.push({
            id: `state-${state}-${Date.now()}`,
            type: 'state-based',
            title: `Discover ${content.title} in ${state}`,
            description: content.description,
            content: content,
            reason: `Similar to your exploration of ${stateRec.state}`,
            priority: 7
          });
        }
      });
    }
    
    // Generate AI-powered contextual recommendations
    try {
      const aiQuery = `Based on user interests in ${topInterests.map(i => i.interest).join(', ')}, suggest 2-3 specific cultural experiences in India that would be most engaging and educational.`;
      const aiResponse = await performCulturalSearch(aiQuery);
      
      recommendations.push({
        id: `ai-contextual-${Date.now()}`,
        type: 'ai-powered',
        title: 'AI Curated Recommendation',
        description: aiResponse,
        reason: 'AI-powered personalized suggestion',
        priority: 8
      });
    } catch (error) {
      console.error('AI recommendation failed:', error);
    }
    
    // Sort by priority and return top 3
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
      
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return getFallbackRecommendations();
  }
}

// Get related states for recommendations
function getRelatedStates(state) {
  const stateRelations = {
    'Kerala': ['Tamil Nadu', 'Karnataka'],
    'Tamil Nadu': ['Kerala', 'Karnataka', 'Andhra Pradesh'],
    'Karnataka': ['Tamil Nadu', 'Kerala', 'Maharashtra'],
    'Rajasthan': ['Gujarat', 'Madhya Pradesh', 'Uttar Pradesh'],
    'Gujarat': ['Rajasthan', 'Maharashtra', 'Madhya Pradesh'],
    'Maharashtra': ['Gujarat', 'Karnataka', 'Madhya Pradesh'],
    'Uttar Pradesh': ['Rajasthan', 'Madhya Pradesh', 'Bihar'],
    'West Bengal': ['Odisha', 'Bihar', 'Jharkhand'],
    'Odisha': ['West Bengal', 'Jharkhand', 'Chhattisgarh'],
    'Punjab': ['Haryana', 'Himachal Pradesh', 'Delhi']
  };
  
  return stateRelations[state] || [];
}

// Fallback recommendations when AI fails
function getFallbackRecommendations() {
  const fallbackContent = [
    {
      id: 'fallback-1',
      type: 'fallback',
      title: 'Explore Classical Dance Forms',
      description: 'Discover the rich tradition of Indian classical dance',
      content: { title: 'Classical Dance', state: 'Various', description: 'Traditional dance forms' },
      reason: 'Popular cultural exploration',
      priority: 5
    },
    {
      id: 'fallback-2',
      type: 'fallback',
      title: 'Visit Heritage Monuments',
      description: 'Explore India\'s architectural marvels',
      content: { title: 'Heritage Sites', state: 'Various', description: 'Historical monuments' },
      reason: 'Essential cultural experience',
      priority: 5
    },
    {
      id: 'fallback-3',
      type: 'fallback',
      title: 'Taste Regional Cuisines',
      description: 'Experience the diverse flavors of India',
      content: { title: 'Regional Food', state: 'Various', description: 'Traditional cuisines' },
      reason: 'Culinary cultural journey',
      priority: 5
    }
  ];
  
  return fallbackContent;
}

// Generate festival recommendations for a specific month
export function generateFestivalRecommendations(month) {
  const festivalData = {
    'January': [
      { name: 'Makar Sankranti', states: ['All India'], description: 'Harvest festival marking the sun\'s northward journey' },
      { name: 'Pongal', states: ['Tamil Nadu'], description: 'Tamil harvest festival' },
      { name: 'Lohri', states: ['Punjab'], description: 'Winter harvest festival' }
    ],
    'February': [
      { name: 'Maha Shivaratri', states: ['All India'], description: 'Great night of Lord Shiva' },
      { name: 'Vasant Panchami', states: ['All India'], description: 'Spring festival dedicated to Goddess Saraswati' }
    ],
    'March': [
      { name: 'Holi', states: ['All India'], description: 'Festival of colors' },
      { name: 'Ugadi', states: ['Karnataka', 'Andhra Pradesh'], description: 'New Year festival' }
    ],
    'April': [
      { name: 'Ram Navami', states: ['All India'], description: 'Birthday of Lord Rama' },
      { name: 'Baisakhi', states: ['Punjab'], description: 'Harvest festival and Sikh New Year' }
    ],
    'May': [
      { name: 'Akshaya Tritiya', states: ['All India'], description: 'Auspicious day for new beginnings' },
      { name: 'Buddha Purnima', states: ['All India'], description: 'Birthday of Lord Buddha' }
    ],
    'June': [
      { name: 'Rath Yatra', states: ['Odisha'], description: 'Chariot festival of Lord Jagannath' },
      { name: 'Guru Purnima', states: ['All India'], description: 'Day to honor spiritual teachers' }
    ],
    'July': [
      { name: 'Guru Purnima', states: ['All India'], description: 'Day to honor spiritual teachers' },
      { name: 'Raksha Bandhan', states: ['All India'], description: 'Festival celebrating sibling bond' }
    ],
    'August': [
      { name: 'Onam', states: ['Kerala'], description: 'Harvest festival of Kerala' },
      { name: 'Raksha Bandhan', states: ['All India'], description: 'Festival celebrating sibling bond' },
      { name: 'Krishna Janmashtami', states: ['All India'], description: 'Birthday of Lord Krishna' }
    ],
    'September': [
      { name: 'Ganesh Chaturthi', states: ['Maharashtra'], description: 'Festival of Lord Ganesha' },
      { name: 'Onam', states: ['Kerala'], description: 'Harvest festival of Kerala' }
    ],
    'October': [
      { name: 'Navratri', states: ['All India'], description: 'Nine nights of Goddess Durga' },
      { name: 'Dussehra', states: ['All India'], description: 'Victory of good over evil' }
    ],
    'November': [
      { name: 'Diwali', states: ['All India'], description: 'Festival of lights' },
      { name: 'Guru Nanak Jayanti', states: ['All India'], description: 'Birthday of Guru Nanak' }
    ],
    'December': [
      { name: 'Christmas', states: ['All India'], description: 'Celebration of Jesus Christ\'s birth' },
      { name: 'New Year', states: ['All India'], description: 'Celebration of new beginnings' }
    ]
  };
  
  return festivalData[month] || [];
}
