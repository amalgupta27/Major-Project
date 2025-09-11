import React, { useState } from 'react';
import './AIButton.css';

const AIButton = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon = '🪶', // Default peacock feather icon
  loading = false,
  disabled = false,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      setIsPressed(true);
      onClick();
      // Reset pressed state after animation
      setTimeout(() => setIsPressed(false), 200);
    }
  };

  return (
    <button
      className={`ai-button ai-button--${variant} ai-button--${size} ${loading ? 'ai-button--loading' : ''} ${isPressed ? 'ai-button--pressed' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      title={children}
    >
      <span className="ai-button__icon">
        {loading ? '✨' : icon}
      </span>
      <span className="ai-button__text">
        {loading ? 'Generating...' : children}
      </span>
      {loading && <div className="ai-button__spinner"></div>}
    </button>
  );
};

export default AIButton;
