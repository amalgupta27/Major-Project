# Cultural Heritage AI Chatbot Setup Guide

This guide will help you set up the AI-powered cultural heritage chatbot for your Cultural Wonders project.

## 🚀 Quick Start

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `env.example` to `.env`
   - Add your API keys (see API Setup section below)

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd cultural-wonders
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🔑 API Setup

### Option 1: OpenAI GPT (Recommended for best results)

1. **Get OpenAI API Key:**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an account or sign in
   - Go to API Keys section
   - Create a new API key

2. **Configure in .env file:**
   ```env
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

### Option 2: HuggingFace (Free alternative)

1. **Get HuggingFace API Key:**
   - Visit [HuggingFace](https://huggingface.co/)
   - Create an account or sign in
   - Go to Settings > Access Tokens
   - Create a new token

2. **Configure in .env file:**
   ```env
   HUGGINGFACE_API_KEY=your_actual_huggingface_api_key_here
   ```

### Option 3: Both APIs (Fallback setup)

You can configure both APIs for redundancy:
```env
OPENAI_API_KEY=your_openai_key_here
HUGGINGFACE_API_KEY=your_huggingface_key_here
```

The system will try OpenAI first, then fall back to HuggingFace if OpenAI fails.

## 🧪 Testing the Chatbot

### 1. Access the Chat Interface

- Navigate to `http://localhost:5173/chat`
- Or click the "💬 AI Chat" link in the navigation menu

### 2. Test with Cultural Questions

Try these sample questions to test different features:

**Dataset Questions (Answered from Cultural Knowledge Base):**
- "What is Kathakali?" → Should get detailed answer from dataset
- "Which state is famous for bamboo crafts?" → Should answer "Assam"
- "What is the story of Konark Sun Temple?" → Should get historical context
- "Which state is Kerala in?" → Should answer "Kerala itself is a state in South India"

**AI Questions (Answered by AI Services):**
- "Tell me about Ajanta Caves in detail" → Should get comprehensive AI response
- "What are some traditional wedding customs in India?" → Should get AI-generated answer
- "Explain the significance of different Indian festivals" → Should get detailed AI response

**Conversation Memory Test:**
1. Ask: "Tell me about Kathakali"
2. Follow up: "Which state is it from?" → Should remember the context
3. Ask: "What other dance forms are from that state?" → Should maintain conversation context

**Speech Feature Test:**
- Click the 🔊 button on any bot message to hear it spoken
- Use the main speech button in the header to repeat the last message
- Test the stop speech functionality

## 🎨 Features

### ✅ Core Features

- **Heritage-inspired UI:** Traditional Indian colors (saffron, peacock blue, maroon) with cultural patterns
- **Real-time chat:** Instant messaging interface with smooth animations
- **Typing animation:** Three-dot typing indicator when AI is responding
- **Bot avatar:** Glowing temple icon with gentle animation
- **Conversation memory:** Maintains context across messages for intelligent responses
- **Responsive design:** Works perfectly on desktop, tablet, and mobile
- **Error handling:** Graceful fallbacks for API failures
- **Sample questions:** Built-in suggestions for users

### 🚀 Enhanced Features

- **Cultural Dataset Integration:** Curated knowledge base with 20+ cultural facts
- **Smart Response System:** Checks dataset first, then falls back to AI
- **Dual AI support:** OpenAI GPT + HuggingFace fallback
- **Text-to-Speech:** AI responses can be spoken aloud using Web Speech API
- **Traditional Styling:** Indian motifs, warm colors, and cultural patterns
- **Conversation Context:** Remembers previous messages for better responses
- **Speech Controls:** Individual speech buttons for each message
- **Beautiful Animations:** Smooth transitions, glowing effects, and pulse animations

### 🎯 Cultural Dataset Coverage

The chatbot includes curated knowledge about:
- **Traditional Arts:** Kathakali, Bharatanatyam, Madhubani painting
- **Crafts & Handicrafts:** Bamboo crafts, Rajasthani pottery, Kashmiri handicrafts
- **Historical Monuments:** Konark Sun Temple, Taj Mahal, Ajanta Caves, Hampi
- **Festivals:** Diwali, Holi, Navratri
- **Regional Cuisines:** Kerala, Rajasthan, Bengali specialties
- **Traditional Attire:** Regional clothing and accessories
- **Geography:** States, capitals, and regional information

## 🔧 Configuration

### Backend Configuration

The backend server can be configured via environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# AI API Keys
OPENAI_API_KEY=your_key_here
HUGGINGFACE_API_KEY=your_key_here
```

### Frontend Configuration

The chatbot component is fully integrated into the existing React app:

- **Route:** `/chat`
- **Component:** `Chatbot.jsx`
- **Styling:** `Chatbot.css`
- **Page:** `Chat.jsx`

## 🐛 Troubleshooting

### Common Issues

1. **"AI service configuration error"**
   - Check that your API keys are correctly set in the `.env` file
   - Ensure the keys are valid and have sufficient credits

2. **"Connection refused"**
   - Make sure the backend server is running on port 5000
   - Check that no firewall is blocking the connection

3. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Consider upgrading your API plan if using frequently

4. **Frontend not loading chat**
   - Ensure both frontend and backend servers are running
   - Check browser console for any JavaScript errors

### Debug Mode

To enable debug logging, set:
```env
NODE_ENV=development
```

This will show detailed logs in the backend console.

## 📱 Mobile Support

The chatbot is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secure and private
- The backend includes CORS protection
- Input validation is implemented for all endpoints

## 🧪 Testing the Implementation

### Automated Testing

Run the test script to verify all features:

```bash
# Make sure backend is running first
cd backend
npm run dev

# In another terminal, run the test
node test-chatbot.js
```

The test script will:
- ✅ Check backend health
- ✅ Test dataset integration (questions answered from cultural knowledge base)
- ✅ Test AI fallback (questions answered by AI services)
- ✅ Verify conversation memory
- ✅ Test error handling

### Manual Testing Checklist

**UI Features:**
- [ ] Traditional Indian colors and patterns are visible
- [ ] Bot avatar glows with gentle animation
- [ ] Typing indicator shows three dots when AI is responding
- [ ] Speech buttons work (🔊 on messages and header)
- [ ] Responsive design works on mobile/tablet

**Functionality:**
- [ ] Dataset questions get accurate, quick responses
- [ ] AI questions get detailed, contextual responses
- [ ] Conversation memory works (follow-up questions maintain context)
- [ ] Speech synthesis works (text-to-speech)
- [ ] Error handling works (graceful fallbacks)

**Cultural Knowledge:**
- [ ] Kathakali information is accurate and detailed
- [ ] Bamboo crafts correctly identified as Assam specialty
- [ ] Konark Sun Temple story is historically accurate
- [ ] State geography questions are answered correctly

## 🎯 Next Steps

The enhanced chatbot is now ready to use! You can:

1. **Test with various cultural questions** using the provided test cases
2. **Customize the cultural dataset** by adding more facts to `backend/data/culturalDataset.js`
3. **Modify AI responses** by updating the system prompt in `backend/services/aiService.js`
4. **Add more features** like voice input, image sharing, or more cultural categories
5. **Deploy to production** when ready

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify your API keys are correct
3. Ensure both servers are running
4. Try the sample questions provided above

Happy exploring Indian cultural heritage! 🏛️✨
