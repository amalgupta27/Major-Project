import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  chatWithAI, 
  getQuizHint, 
  generateCulturalStory, 
  generateTravelItinerary, 
  generateHistoricalPerspective, 
  performCulturalSearch 
} from './services/aiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cultural Heritage Chatbot API is running',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    console.log('Received chat request:', { message, historyLength: conversationHistory.length });

    // Get AI response
    const aiResponse = await chatWithAI(message, conversationHistory);

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle different types of errors
    if (error.message.includes('API key')) {
      return res.status(401).json({ 
        error: 'AI service configuration error. Please check API keys.' 
      });
    }
    
    if (error.message.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error. Please try again.' 
    });
  }
});

// Quiz hint endpoint
app.post('/api/quiz-hint', async (req, res) => {
  try {
    const { question, options = [] } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Question is required' 
      });
    }

    console.log('Received quiz hint request:', { question, optionsCount: options.length });

    const hint = await getQuizHint(question, options);

    res.json({
      success: true,
      hint: hint,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Quiz hint API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate hint. Please try again.' 
    });
  }
});

// Cultural story generation endpoint
app.post('/api/generate-story', async (req, res) => {
  try {
    const { topic, context = '' } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Topic is required' 
      });
    }

    console.log('Received story generation request:', { topic, context });

    const story = await generateCulturalStory(topic, context);

    res.json({
      success: true,
      story: story,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Story generation API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate story. Please try again.' 
    });
  }
});

// Travel itinerary endpoint
app.post('/api/travel-guide', async (req, res) => {
  try {
    const { state, duration = 5 } = req.body;

    if (!state || state.trim().length === 0) {
      return res.status(400).json({ 
        error: 'State is required' 
      });
    }

    console.log('Received travel guide request:', { state, duration });

    const itinerary = await generateTravelItinerary(state, duration);

    res.json({
      success: true,
      itinerary: itinerary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Travel guide API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate travel guide. Please try again.' 
    });
  }
});

// Historical perspective endpoint
app.post('/api/historical-perspective', async (req, res) => {
  try {
    const { tradition, context = '' } = req.body;

    if (!tradition || tradition.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Tradition is required' 
      });
    }

    console.log('Received historical perspective request:', { tradition, context });

    const perspective = await generateHistoricalPerspective(tradition, context);

    res.json({
      success: true,
      perspective: perspective,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Historical perspective API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate historical perspective. Please try again.' 
    });
  }
});

// Import cultural dataset at the top level
import { culturalDataset, getRandomCulturalFacts } from './data/culturalDataset.js';

// Helper function to get random suggestions
async function getRandomSuggestions(count = 5) {
  try {
    const randomFacts = getRandomCulturalFacts(count);
    return randomFacts.map(fact => fact.question);
  } catch (error) {
    console.error('Error getting random suggestions:', error);
    return ["Indian culture", "Traditional arts", "Heritage sites", "Festivals of India", "Historical monuments"];
  }
}

// Helper function to get related suggestions based on query
async function getRelatedSuggestions(query, count = 5) {
  try {
    const queryLower = query.toLowerCase();
    
    // Find facts with matching keywords
    const relatedFacts = culturalDataset.filter(fact => 
      fact.keywords.some(keyword => 
        keyword.toLowerCase().includes(queryLower) || 
        fact.question.toLowerCase().includes(queryLower)
      )
    );
    
    // If not enough matches, add random ones
    if (relatedFacts.length < count) {
      const additionalFacts = getRandomCulturalFacts(count - relatedFacts.length);
      relatedFacts.push(...additionalFacts);
    }
    
    return relatedFacts.slice(0, count).map(fact => fact.question);
  } catch (error) {
    console.error('Error getting related suggestions:', error);
    return await getRandomSuggestions(count);
  }
}

// Helper function to get alternative queries
function getAlternativeQueries(query) {
  // Simple implementation - can be enhanced with a more sophisticated algorithm
  const alternatives = [
    `history of ${query}`,
    `culture of ${query}`,
    `traditions in ${query}`,
    `famous places in ${query}`,
    `heritage sites in ${query}`
  ];
  
  return [...new Set(alternatives)]; // Remove duplicates
}

// Helper function to search cultural dataset
function searchCulturalDataset(query) {
  const { culturalDataset } = require('./data/culturalDataset');
  const queryLower = query.toLowerCase();
  
  return culturalDataset.filter(item => 
    item.question.toLowerCase().includes(queryLower) ||
    item.answer.toLowerCase().includes(queryLower) ||
    item.keywords.some(keyword => keyword.toLowerCase().includes(queryLower))
  );
}

// Cultural search endpoint
app.post('/api/cultural-search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
        suggestions: await getRandomSuggestions()
      });
    }
    
    // Log the search query for debugging
    console.log(`Processing cultural search for: ${query}`);
    
    // Try to find exact matches in the cultural dataset first
    const exactMatches = findCulturalFact(query);
    if (exactMatches && exactMatches.length > 0) {
      return res.json({
        success: true,
        results: exactMatches,
        source: 'cultural_dataset',
        suggestions: await getRelatedSuggestions(query)
      });
    }
    
    // If no exact matches, try AI-powered search
    try {
      const aiResults = await performCulturalSearch(query);
      if (aiResults && aiResults.length > 0) {
        return res.json({
          success: true,
          results: aiResults,
          source: 'ai_service',
          suggestions: await getRelatedSuggestions(query)
        });
      }
      
      // If we get here, no results were found
      return res.status(404).json({
        success: false,
        error: 'No cultural information found',
        suggestions: await getRelatedSuggestions(query),
        alternativeQueries: getAlternativeQueries(query)
      });
      
    } catch (aiError) {
      console.error('AI Search Error:', aiError);
      // Fallback to basic search if AI service fails
      const basicResults = searchCulturalDataset(query);
      if (basicResults && basicResults.length > 0) {
        return res.json({
          success: true,
          results: basicResults,
          source: 'fallback_search',
          suggestions: await getRelatedSuggestions(query)
        });
      }
      
      // If all else fails
      return res.status(503).json({
        success: false,
        error: 'Unable to process your request at the moment',
        suggestions: await getRandomSuggestions(),
        retryAfter: 30 // seconds
      });
    }
  } catch (error) {
    console.error('Cultural search API Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to perform search. Please try again.',
      suggestions: await getRandomSuggestions()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Cultural Heritage Chatbot API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});
