import React, { useState, useEffect, useRef } from 'react';
import { performCulturalSearch } from '../services/aiService';
import AIButton from './AIButton';
import AIResponse from './AIResponse';
import './VoiceInteraction.css';

const VoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in this browser');
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setAiResponse('');
      setError('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceQuery = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      const response = await performCulturalSearch(transcript);
      setAiResponse(response);
      
      // Speak the response
      speakText(response);
    } catch (error) {
      console.error('Error processing voice query:', error);
      setError('Sorry, I couldn\'t process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text) => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';
      
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const clearAll = () => {
    setTranscript('');
    setAiResponse('');
    setError('');
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
  };

  const getVoiceButtonIcon = () => {
    if (isListening) return '🎤';
    if (isProcessing) return '⏳';
    return '🎙️';
  };

  const getVoiceButtonVariant = () => {
    if (isListening) return 'accent';
    if (isProcessing) return 'secondary';
    return 'primary';
  };

  return (
    <div className="voice-interaction">
      <div className="voice-header">
        <h2>🎙️ Voice AI Assistant</h2>
        <p>Ask questions about Indian culture using your voice</p>
        <AIButton
          onClick={() => setShowVoiceInterface(!showVoiceInterface)}
          variant="primary"
          size="medium"
          icon="🎙️"
        >
          {showVoiceInterface ? 'Hide Voice Interface' : 'Show Voice Interface'}
        </AIButton>
      </div>

      {showVoiceInterface && (
        <div className="voice-interface">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="voice-controls">
            <div className="voice-button-container">
              <AIButton
                onClick={isListening ? stopListening : startListening}
                variant={getVoiceButtonVariant()}
                size="large"
                icon={getVoiceButtonIcon()}
                loading={isProcessing}
                disabled={isProcessing}
                className="voice-button"
              >
                {isListening ? 'Stop Listening' : isProcessing ? 'Processing...' : 'Start Voice Query'}
              </AIButton>
            </div>

            <div className="voice-status">
              {isListening && (
                <div className="listening-indicator">
                  <div className="pulse-ring"></div>
                  <span>Listening... Speak now</span>
                </div>
              )}
              {isProcessing && (
                <div className="processing-indicator">
                  <div className="spinner"></div>
                  <span>AI is processing your question...</span>
                </div>
              )}
            </div>
          </div>

          {transcript && (
            <div className="transcript-section">
              <h3>🎯 Your Question:</h3>
              <div className="transcript-box">
                <p>"{transcript}"</p>
                <AIButton
                  onClick={processVoiceQuery}
                  variant="primary"
                  size="small"
                  icon="🤖"
                  loading={isProcessing}
                  disabled={isProcessing || !transcript.trim()}
                >
                  Ask AI
                </AIButton>
              </div>
            </div>
          )}

          {aiResponse && (
            <div className="ai-response-section">
              <h3>🤖 AI Response:</h3>
              <AIResponse
                content={aiResponse}
                type="search"
                icon="🤖"
              />
              <div className="response-actions">
                <AIButton
                  onClick={() => speakText(aiResponse)}
                  variant="secondary"
                  size="small"
                  icon="🔊"
                >
                  Listen Again
                </AIButton>
                <AIButton
                  onClick={clearAll}
                  variant="ghost"
                  size="small"
                  icon="🗑️"
                >
                  Clear All
                </AIButton>
              </div>
            </div>
          )}

          <div className="voice-examples">
            <h4>💡 Try asking:</h4>
            <div className="example-queries">
              <button 
                className="example-query"
                onClick={() => setTranscript("Tell me about Odisha temples")}
              >
                "Tell me about Odisha temples"
              </button>
              <button 
                className="example-query"
                onClick={() => setTranscript("What are the famous dance forms of North India?")}
              >
                "What are the famous dance forms of North India?"
              </button>
              <button 
                className="example-query"
                onClick={() => setTranscript("Show me festivals in August")}
              >
                "Show me festivals in August"
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInteraction;
