import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { quizQuestions } from '../data/culturalData'
import { getQuizHint } from '../services/aiService'
import AIButton from '../components/AIButton'
import AIResponse from '../components/AIResponse'
import './Quiz.css'

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [aiHint, setAiHint] = useState('')
  const [showAiHint, setShowAiHint] = useState(false)
  const [isLoadingHint, setIsLoadingHint] = useState(false)
  
  const questionRef = useRef(null)
  const optionsRef = useRef(null)
  const scoreRef = useRef(null)

  useEffect(() => {
    // GSAP animation for quiz entrance
    gsap.fromTo('.quiz-container', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )
  }, [])

  useEffect(() => {
    if (questionRef.current) {
      // Animate question change
      gsap.fromTo(questionRef.current, 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [currentQuestion])

  const handleAnswerClick = (selectedOption) => {
    if (selectedAnswer !== null) return // Prevent multiple selections
    
    setSelectedAnswer(selectedOption)
    const correct = selectedOption === quizQuestions[currentQuestion].correct
    setIsCorrect(correct)
    
    if (correct) {
      setScore(score + 1)
    }
    
    // Show explanation after a short delay
    setTimeout(() => {
      setShowExplanation(true)
    }, 1000)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setShowExplanation(false)
      setAiHint('')
      setShowAiHint(false)
      
      // Animate options entrance
      gsap.fromTo(optionsRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    } else {
      setShowScore(true)
      // Animate score display
      gsap.fromTo(scoreRef.current, 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
      )
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowExplanation(false)
    setAiHint('')
    setShowAiHint(false)
  }

  const handleGetHint = async () => {
    if (isLoadingHint) return
    
    setIsLoadingHint(true)
    try {
      const currentQ = quizQuestions[currentQuestion]
      const hint = await getQuizHint(currentQ.question, currentQ.options)
      setAiHint(hint)
      setShowAiHint(true)
    } catch (error) {
      console.error('Error getting hint:', error)
      setAiHint('Sorry, I couldn\'t generate a hint right now. Please try again!')
      setShowAiHint(true)
    } finally {
      setIsLoadingHint(false)
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100
    if (percentage >= 90) return "🎉 Excellent! You're a cultural expert!"
    if (percentage >= 70) return "👏 Great job! You know your Indian heritage well!"
    if (percentage >= 50) return "👍 Good effort! Keep learning about Indian culture!"
    return "📚 Keep exploring! There's so much more to discover about Indian heritage!"
  }

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100
    if (percentage >= 90) return "#FFD700"
    if (percentage >= 70) return "#10B981"
    if (percentage >= 50) return "#F59E0B"
    return "#EF4444"
  }

  if (showScore) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>🎯 Cultural Quiz Results</h1>
          <p>Test your knowledge of Indian heritage</p>
        </div>
        
        <div className="score-display" ref={scoreRef}>
          <div className="score-circle" style={{ borderColor: getScoreColor() }}>
            <span className="score-number">{score}</span>
            <span className="score-total">/{quizQuestions.length}</span>
          </div>
          <h2 className="score-percentage">
            {Math.round((score / quizQuestions.length) * 100)}%
          </h2>
          <p className="score-message">{getScoreMessage()}</p>
          
          <div className="score-actions">
            <button className="btn-restart" onClick={handleRestart}>
              🔄 Take Quiz Again
            </button>
            <button className="btn-explore" onClick={() => window.location.href = '/'}>
              🏠 Explore More
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>🎯 Cultural Heritage Quiz</h1>
        <p>Test your knowledge of Indian traditions, arts, and heritage</p>
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
        </div>
      </div>

      <div className="question-container" ref={questionRef}>
        <div className="question-card">
          <div className="question-header">
            <h2 className="question-text">{currentQ.question}</h2>
            <AIButton
              onClick={handleGetHint}
              variant="secondary"
              size="small"
              icon="💡"
              loading={isLoadingHint}
              disabled={selectedAnswer !== null}
            >
              Ask AI for a hint
            </AIButton>
          </div>

          {showAiHint && (
            <AIResponse
              content={aiHint}
              type="hint"
              icon="💡"
            />
          )}
          
          <div className="options-container" ref={optionsRef}>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswer === index
                    ? index === currentQ.correct
                      ? 'correct'
                      : 'incorrect'
                    : ''
                } ${selectedAnswer !== null && index === currentQ.correct ? 'correct' : ''}`}
                onClick={() => handleAnswerClick(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {selectedAnswer === index && (
                  <span className="option-icon">
                    {index === currentQ.correct ? '✅' : '❌'}
                  </span>
                )}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="explanation">
              <h3>💡 Explanation</h3>
              <p>{currentQ.explanation}</p>
              <button className="btn-next" onClick={handleNextQuestion}>
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quiz
