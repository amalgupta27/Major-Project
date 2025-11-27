# Cultural Heritage Explorer

A comprehensive web application that showcases India's rich cultural heritage through an interactive platform featuring state-wise cultural information, AI-powered chat, and educational resources.

## 🌟 Features

- **Interactive Map**: Explore cultural heritage across different states of India
- **AI-Powered Chatbot**: Get information about Indian culture, traditions, and history
- **State-wise Information**: Detailed cultural insights for each Indian state
- **Quiz System**: Test your knowledge about Indian culture
- **Travel Itinerary Generator**: Plan cultural trips with AI-generated itineraries
- **Cultural Stories**: Read and generate stories about Indian traditions
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- **React** - Frontend library
- **React Router** - Navigation
- **GSAP** - Animations and transitions
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling (if used, based on project structure)

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **OpenAI API** - AI-powered chat and content generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📂 Project Structure

```
Major-Project/
├── backend/                 # Backend server code
│   ├── data/               # Cultural dataset and state information
│   ├── services/           # AI and business logic
│   ├── .env                # Environment variables
│   ├── server.js           # Main server file
│   └── package.json
│
├── cultural-wonders/       # Frontend React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── data/           # Frontend data (like statesData.js)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   └── package.json
│
└── README.md               # This file
```

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (for full AI functionality)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd cultural-wonders
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## 🌐 API Endpoints

- `POST /api/chat` - Chat with the AI assistant
- `GET /api/health` - Health check endpoint
- `POST /api/quiz/hint` - Get hints for quiz questions
- `POST /api/generate/story` - Generate cultural stories
- `POST /api/generate/itinerary` - Generate travel itineraries
- `POST /api/cultural-search` - Search cultural information

## 🤖 AI Features

- **Cultural Chat**: Interactive Q&A about Indian culture
- **Quiz Hints**: Get helpful hints for cultural quiz questions
- **Story Generation**: Generate stories based on cultural topics
- **Travel Planning**: Create customized travel itineraries
- **Historical Context**: Get historical perspectives on traditions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Cultural data sourced from various authentic resources
- Built with modern web technologies
- Special thanks to the open-source community for their valuable tools and libraries
