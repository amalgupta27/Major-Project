import React, { useState, useRef, useEffect } from 'react';
import { statesData } from '../data/statesData';
import { culturalDataset } from '../../../backend/data/culturalDataset';
import { performCulturalSearch } from '../services/aiService';
import AIButton from './AIButton';
import AIResponse from './AIResponse';
import './AISearch.css';

const AISearch = ({ onSearchResults = null, placeholder = "Search cultural heritage..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  // Collect all keywords and state names for suggestions
  const allSuggestions = [
    ...statesData.map(s => s.name),
    ...culturalDataset.flatMap(f => f.keywords || []),
    ...culturalDataset.map(f => f.question)
  ];

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    setSuggestions(
      allSuggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 7)
    );
  }, [query]);
  // Voice input logic
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const searchResults = await performCulturalSearch(query.trim());
      setResults(searchResults);
      setShowResults(true);
      
      // Call callback if provided
      if (onSearchResults) {
        onSearchResults(query, searchResults);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setResults('Sorry, I couldn\'t perform the search right now. Please try again!');
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="ai-search">
      <div className="ai-search__container">
        <div className="ai-search__input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="ai-search__input"
            disabled={isLoading}
            autoComplete="off"
          />
          <AIButton
            onClick={handleSearch}
            variant="primary"
            size="small"
            icon="🔍"
            loading={isLoading}
            disabled={!query.trim()}
            className="ai-search__button"
          >
            Search
          </AIButton>
          <AIButton
            onClick={startListening}
            variant="secondary"
            size="small"
            icon={isListening ? '🎤' : '🎙️'}
            loading={false}
            disabled={isLoading}
            className="ai-search__button"
          >
            Voice
          </AIButton>
        </div>
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="ai-search__suggestions">
            <h4>Suggestions</h4>
            <div className="ai-search__suggestion-tags">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="ai-search__suggestion-tag"
                  onClick={() => setQuery(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {showResults && (
          <AIResponse
            content={results}
            type="search"
            icon="🔍"
          />
        )}
      </div>
    </div>
  );
};

export default AISearch;
