import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm your cultural heritage guide. I can help you learn about Indian traditions, arts, crafts, festivals, and historical monuments. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Prepare conversation history for the API (excluding the current user message)
      const historyForAPI = conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: historyForAPI
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Simulate typing delay for better UX
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        setConversationHistory(prev => [...prev, userMessage, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble connecting right now. Please make sure the backend server is running and try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setConversationHistory(prev => [...prev, userMessage, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // Text-to-Speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speech function
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="bot-avatar">
          <div className="avatar-icon">🏛️</div>
        </div>
        <div className="header-info">
          <h3>Cultural Heritage Guide</h3>
          <p>Your AI companion for Indian culture</p>
        </div>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Online</span>
        </div>
        <div className="speech-controls">
          <button 
            className={`speech-btn ${isSpeaking ? 'speaking' : ''}`}
            onClick={isSpeaking ? stopSpeaking : () => speakText(messages[messages.length - 1]?.text || '')}
            title={isSpeaking ? 'Stop speaking' : 'Listen to last message'}
          >
            {isSpeaking ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.sender === 'bot' && (
              <div className="message-avatar">
                <div className="avatar-icon">🏛️</div>
              </div>
            )}
            <div className="message-content">
              <div className="message-bubble">
                <p>{message.text}</p>
                <div className="message-footer">
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                  {message.sender === 'bot' && (
                    <button 
                      className="message-speech-btn"
                      onClick={() => speakText(message.text)}
                      title="Listen to this message"
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>
            </div>
            {message.sender === 'user' && (
              <div className="message-avatar user-avatar">
                <div className="avatar-icon">👤</div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message typing-message">
            <div className="message-avatar">
              <div className="avatar-icon">🏛️</div>
            </div>
            <div className="message-content">
              <div className="message-bubble typing-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about Indian culture, traditions, arts, or heritage..."
            disabled={isLoading}
            rows="1"
            className="message-input"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <span>📤</span>
            )}
          </button>
        </div>
        <div className="input-footer">
          <small>Press Enter to send, Shift+Enter for new line</small>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
