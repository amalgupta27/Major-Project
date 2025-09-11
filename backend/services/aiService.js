import OpenAI from 'openai';
import axios from 'axios';
import { findCulturalFact } from '../data/culturalDataset.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load statesData.js as JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const statesDataPath = path.join(__dirname, '../..', 'cultural-wonders', 'src', 'data', 'statesData.js');
let statesData = [];
try {
  const fileContent = fs.readFileSync(statesDataPath, 'utf-8');
  // Extract the array from the JS file
  const match = fileContent.match(/export const statesData = (\[.*?\]);/s);
  if (match) {
    statesData = eval(match[1]);
  }
} catch (e) {
  console.warn('Could not load statesData.js:', e.message);
}

// Initialize OpenAI client (only if API key is available)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Cultural Heritage System Prompt
const SYSTEM_PROMPT = `You are a knowledgeable cultural heritage guide specializing in Indian culture, traditions, arts, crafts, festivals, and historical monuments. 

Your role is to:
- Provide accurate, engaging information about Indian cultural heritage
- Share interesting stories and historical context
- Explain traditional arts, crafts, and their significance
- Discuss festivals, their origins, and celebrations
- Describe architectural marvels and their cultural importance
- Be respectful and inclusive of all cultural diversity in India

Guidelines:
- Keep responses informative but conversational
- Use simple, clear language
- Include interesting facts and anecdotes when relevant
- If asked about something outside Indian culture, politely redirect to Indian cultural topics
- Always maintain a warm, welcoming tone
- Limit responses to 2-3 paragraphs for better readability

Remember: You're helping people discover and appreciate the rich cultural heritage of India.`;

// Specialized prompts for different AI features
const HINT_PROMPT = `You are a helpful quiz assistant for a cultural heritage museum. Your job is to provide hints for quiz questions about Indian culture, NOT the full answer.

Guidelines:
- Give a subtle clue that guides the user toward the answer
- Don't reveal the complete answer
- Make hints educational and interesting
- Keep hints to 1-2 sentences
- Use geographical, historical, or cultural context as hints

Example: For "Which state is famous for Kathakali?" 
Good hint: "This state is located in South India and is known for its beautiful backwaters and coconut trees."
Bad hint: "It's Kerala"`;

const STORYTELLING_PROMPT = `You are a master storyteller specializing in Indian cultural heritage. Create immersive, engaging stories that bring cultural traditions to life.

Guidelines:
- Write in first person or narrative style
- Use vivid, descriptive language
- Include sensory details (sights, sounds, smells)
- Make it educational but entertaining
- Keep stories to 3-4 paragraphs
- Start with an engaging hook

Example: "Imagine walking into a cave where monks painted tales of Buddha on the walls over 2000 years ago..."`;

const TRAVEL_GUIDE_PROMPT = `You are an expert travel guide specializing in Indian cultural heritage tourism. Create detailed, practical travel itineraries.

Guidelines:
- Provide day-by-day itineraries (3-5 days)
- Include heritage sites, local food, and cultural experiences
- Mention practical details (timing, transportation)
- Focus on authentic cultural experiences
- Keep each day's activities manageable
- Include local specialties and traditions

Format: Day X: [City] → [Activities]`;

const HISTORICAL_PERSPECTIVE_PROMPT = `You are a time-traveling cultural historian. Provide immersive perspectives on how people 200 years ago might have experienced Indian cultural traditions.

Guidelines:
- Write from a historical perspective (200 years ago)
- Use period-appropriate language and context
- Include social, religious, and cultural context of that era
- Make it immersive and educational
- Keep to 2-3 paragraphs
- Focus on the emotional and cultural significance

Example: "In the villages of Bihar, women painted walls during festivals, believing it would invite blessings of the gods..."`;

const SEARCH_PROMPT = `You are a cultural heritage search assistant. Help users find relevant information across the museum's collections.

Guidelines:
- Understand user intent and provide relevant suggestions
- Suggest specific states, monuments, or cultural elements
- Provide educational context
- Keep responses concise but informative
- Guide users to explore related topics

Example: For "dance forms of North India" → suggest Kathak, folk dances, and relevant states.`;

/**
 * Chat with AI using OpenAI GPT
 */
async function chatWithOpenAI(message, conversationHistory = []) {
  if (!openai) {
    throw new Error('OpenAI API key not configured. Please add your OpenAI API key to the .env file.');
  }
  
  try {
    // Prepare conversation messages
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

/**
 * Chat with AI using HuggingFace Transformers (Free alternative)
 */
async function chatWithHuggingFace(message, conversationHistory = []) {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (!apiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    // Use a conversational model from HuggingFace
    const model = 'microsoft/DialoGPT-medium';
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

    // Prepare the input text
    const context = conversationHistory
      .slice(-5) // Keep last 5 messages for context
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n');
    
    const inputText = context ? `${context}\nHuman: ${message}\nAssistant:` : `Human: ${message}\nAssistant:`;

    const response = await axios.post(apiUrl, {
      inputs: inputText,
      parameters: {
        max_length: 200,
        temperature: 0.7,
        do_sample: true,
        pad_token_id: 50256
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    if (response.data && response.data.generated_text) {
      // Extract the assistant's response
      const generatedText = response.data.generated_text;
      const assistantResponse = generatedText.split('Assistant:').pop().trim();
      return assistantResponse || 'I apologize, but I had trouble generating a response. Could you please rephrase your question?';
    }

    throw new Error('No response generated from HuggingFace API');

  } catch (error) {
    console.error('HuggingFace API Error:', error);
    
    if (error.response?.status === 503) {
      throw new Error('HuggingFace model is loading. Please try again in a few moments.');
    }
    
    throw new Error(`HuggingFace API error: ${error.message}`);
  }
}

/**
 * Main chat function that checks cultural dataset first, then tries AI services
 */
export async function chatWithAI(message, conversationHistory = []) {
  console.log('Processing message:', message);

  // 1. Check our cultural dataset for exact or close matches
  const culturalFact = findCulturalFact(message);
  if (culturalFact) {
    console.log('Found cultural fact in dataset:', culturalFact.category);
    return culturalFact.answer;
  }

  // 2. Check statesData for state-related queries
  const normalizedMsg = message.toLowerCase();
  for (const state of statesData) {
    if (
      normalizedMsg.includes(state.name.toLowerCase()) ||
      (state.intro && normalizedMsg.includes(state.intro.toLowerCase().split(' ')[0]))
    ) {
      return `Here's some information about ${state.name}:\n${state.intro}`;
    }
  }

  console.log('No cultural fact or state found, using AI service...');

  // 3. If no match found, use AI services
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      console.log('Using OpenAI GPT for chat response');
      return await chatWithOpenAI(message, conversationHistory);
    } catch (error) {
      console.warn('OpenAI failed, trying HuggingFace:', error.message);
    }
  }

  // Fallback to HuggingFace
  if (process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_API_KEY !== 'your_huggingface_api_key_here') {
    try {
      console.log('Using HuggingFace for chat response');
      return await chatWithHuggingFace(message, conversationHistory);
    } catch (error) {
      console.error('HuggingFace also failed:', error.message);
    }
  }

  // If both AI services fail, return a helpful fallback response
  return `I'd love to help you learn about Indian cultural heritage! However, I need to be configured with an AI service to provide detailed responses beyond our cultural database.

For now, I can tell you that our cultural database contains information about:
- Traditional arts and crafts
- Historical monuments
- Festivals and celebrations
- Regional cuisines
- Dance forms and music

To get full AI-powered responses, please add your OpenAI API key to the backend/.env file. You can get a free API key from https://platform.openai.com/

In the meantime, try asking about specific cultural topics like "Tell me about Kathakali dance" or "What is Diwali?" - I might have information about these in our database!`;
}

/**
 * Get AI hint for quiz question
 */
export async function getQuizHint(question, options = []) {
  try {
    const prompt = `${HINT_PROMPT}\n\nQuiz Question: "${question}"\nOptions: ${options.join(', ')}\n\nProvide a helpful hint:`;
    return await chatWithAI(prompt, []);
  } catch (error) {
    return `💡 Here's a hint: Think about the cultural context and regional significance. Consider the geographical location and traditional practices associated with this topic. Good luck!`;
  }
}

/**
 * Generate cultural story from diary entry
 */
export async function generateCulturalStory(topic, context = '') {
  try {
    const prompt = `${STORYTELLING_PROMPT}\n\nCreate an engaging story about: "${topic}"\nContext: ${context}\n\nStory:`;
    return await chatWithAI(prompt, []);
  } catch (error) {
    return `📖 Once upon a time, in the rich cultural tapestry of India, ${topic} held a special place in the hearts of people. This tradition has been passed down through generations, carrying with it stories of devotion, artistry, and community. The beauty of Indian culture lies in how each tradition connects us to our heritage and brings communities together in celebration.`;
  }
}

/**
 * Generate travel itinerary for a state
 */
export async function generateTravelItinerary(state, duration = 5) {
  try {
    const prompt = `${TRAVEL_GUIDE_PROMPT}\n\nCreate a ${duration}-day cultural heritage travel itinerary for ${state}, India.\n\nItinerary:`;
    return await chatWithAI(prompt, []);
  } catch (error) {
    return `🗺️ Here's a suggested ${duration}-day cultural heritage itinerary for ${state}:

Day 1: Arrive and explore the capital city's historical monuments and local markets
Day 2: Visit ancient temples, forts, or palaces that showcase the state's architectural heritage
Day 3: Experience local festivals, traditional arts, and crafts workshops
Day 4: Explore regional cuisine, visit heritage villages, and meet local artisans
Day 5: Attend cultural performances, visit museums, and shop for authentic handicrafts

Each day should include time for local food experiences and interactions with the community to truly understand the cultural heritage of ${state}.`;
  }
}

/**
 * Generate historical perspective for tradition
 */
export async function generateHistoricalPerspective(tradition, context = '') {
  try {
    const prompt = `${HISTORICAL_PERSPECTIVE_PROMPT}\n\nTradition: "${tradition}"\nContext: ${context}\n\nHistorical perspective (200 years ago):`;
    return await chatWithAI(prompt, []);
  } catch (error) {
    return `⏰ Two hundred years ago, in the early 19th century, ${tradition} was deeply woven into the fabric of daily life. People of that era would have experienced this tradition as an integral part of their cultural identity, passed down through generations with great reverence. The practice would have been surrounded by stories, rituals, and community gatherings that strengthened social bonds and preserved cultural knowledge for future generations.`;
  }
}

/**
 * AI-powered cultural search
 */
export async function performCulturalSearch(query) {
  try {
    const prompt = `${SEARCH_PROMPT}\n\nUser search query: "${query}"\n\nProvide relevant cultural heritage suggestions:`;
    return await chatWithAI(prompt, []);
  } catch (error) {
    return `🔍 Based on your search for "${query}", here are some cultural heritage suggestions:

• Explore our Heritage section to discover ancient monuments and historical sites
• Check out the States section to learn about regional cultural diversity
• Visit our Quiz section to test your knowledge of Indian culture
• Browse through our cultural database for specific information

Our cultural database contains information about traditional arts, crafts, festivals, monuments, and regional specialties across India. Try asking specific questions like "Tell me about Kathakali dance" or "What is the history of Taj Mahal?"`;
  }
}

/**
 * Get available AI services status
 */
export function getAIServicesStatus() {
  const openaiAvailable = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
  const huggingfaceAvailable = process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_API_KEY !== 'your_huggingface_api_key_here';

  return {
    openai: openaiAvailable,
    huggingface: huggingfaceAvailable,
    primary: openaiAvailable ? 'openai' : (huggingfaceAvailable ? 'huggingface' : 'none')
  };
}
