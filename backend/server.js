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

// Cultural search endpoint
app.post('/api/cultural-search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    console.log('Received cultural search request:', { query });

    const results = await performCulturalSearch(query);

    res.json({
      success: true,
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cultural search API Error:', error);
    res.status(500).json({ 
      error: 'Failed to perform search. Please try again.' 
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
