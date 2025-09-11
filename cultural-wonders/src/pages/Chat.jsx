import React from 'react';
import Chatbot from '../components/Chatbot';
import './Chat.css';

const Chat = () => {
  return (
    <div className="chat-page">
      <div className="chat-page-header">
        <div className="header-content">
          <h1>Cultural Heritage Chat</h1>
          <p>Discover the rich tapestry of Indian culture through conversation with our AI guide</p>
        </div>
        <div className="header-decoration">
          <div className="cultural-pattern"></div>
        </div>
      </div>
      
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="sidebar-section">
            <h3>💬 Chat Topics</h3>
            <div className="topic-suggestions">
              <button className="topic-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                🎭 Traditional Arts
              </button>
              <button className="topic-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                🏺 Crafts & Handicrafts
              </button>
              <button className="topic-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                🎉 Festivals
              </button>
              <button className="topic-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                🏛️ Historical Monuments
              </button>
              <button className="topic-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                🍛 Regional Cuisines
              </button>
              <button className="topic-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                👘 Traditional Attire
              </button>
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3>💡 Sample Questions</h3>
            <div className="sample-questions">
              <p>• "Tell me about Kathakali dance"</p>
              <p>• "Which state is famous for bamboo crafts?"</p>
              <p>• "What is the story of Konark Sun Temple?"</p>
              <p>• "Explain the significance of Diwali"</p>
              <p>• "What are the traditional crafts of Rajasthan?"</p>
            </div>
          </div>
        </div>
        
        <div className="chat-main">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default Chat;
