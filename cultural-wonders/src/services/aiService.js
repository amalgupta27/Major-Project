// Frontend AI Service - handles all AI API calls

const API_BASE_URL = 'http://localhost:5000/api';

// Generic AI API call function
async function callAIEndpoint(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`AI API Error (${endpoint}):`, error);
    throw error;
  }
}

// Quiz hint service
export async function getQuizHint(question, options = []) {
  const result = await callAIEndpoint('/quiz-hint', { question, options });
  return result.hint;
}

// Cultural story generation service
export async function generateCulturalStory(topic, context = '') {
  const result = await callAIEndpoint('/generate-story', { topic, context });
  return result.story;
}

// Travel guide service
export async function generateTravelItinerary(state, duration = 5) {
  const result = await callAIEndpoint('/travel-guide', { state, duration });
  return result.itinerary;
}

// Historical perspective service
export async function generateHistoricalPerspective(tradition, context = '') {
  const result = await callAIEndpoint('/historical-perspective', { tradition, context });
  return result.perspective;
}

// Cultural search service
export async function performCulturalSearch(query) {
  const result = await callAIEndpoint('/cultural-search', { query });
  return result.results;
}

// Chat service (existing)
export async function sendChatMessage(message, conversationHistory = []) {
  const result = await callAIEndpoint('/chat', { message, conversationHistory });
  return result.response;
}
