import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { explainTopic, summarizeNotes, generateQuiz, generateFlashcards } from '../services/apiService';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, type, query, isLoading, needsProcessing } = location.state || {};

  // State for quiz interactions
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [currentResult, setCurrentResult] = useState(result);
  const [isProcessing, setIsProcessing] = useState(isLoading || needsProcessing);

  // If no result data and not processing, redirect back to dashboard
  if (!currentResult && !isProcessing) {
    navigate('/dashboard');
    return null;
  }

  // Update result when location state changes (AI loading complete)
  useEffect(() => {
    if (result !== undefined) {
      // Handle API response objects
      if (typeof result === 'object' && result !== null) {
        if (type === 'quiz' && result.questions) {
          setCurrentResult(result.questions);
        } else if (type === 'flashcards' && result.flashcards) {
          setCurrentResult(result.flashcards);
        } else if (result.result) {
          setCurrentResult(result.result);
        } else {
          setCurrentResult(result);
        }
      } else {
        setCurrentResult(result);
      }
    }
  }, [result, type]);

  // Process AI request if needed
  useEffect(() => {
    if (needsProcessing && type && query) {
      const processAIRequest = async () => {
        try {
          let apiResponse;
          switch(type) {
            case 'explain':
              apiResponse = await explainTopic(query);
              setCurrentResult(apiResponse.result || apiResponse);
              break;
            case 'summarize':
              apiResponse = await summarizeNotes(query);
              setCurrentResult(apiResponse.result || apiResponse);
              break;
            case 'quiz':
              apiResponse = await generateQuiz(query);
              setCurrentResult(apiResponse.questions || apiResponse);
              break;
            case 'flashcards':
              apiResponse = await generateFlashcards(query);
              setCurrentResult(apiResponse.flashcards || apiResponse);
              break;
            default:
              setCurrentResult("I'm here to help! Try asking me to explain a topic, summarize notes, or generate quizzes/flashcards.");
          }

          setIsProcessing(false);
        } catch (error) {
          console.error('AI request failed:', error);
          setCurrentResult(`Sorry, I encountered an error while processing your request. Please check your internet connection and make sure your OpenRouter API key is configured correctly in the .env file.\n\nError: ${error.message}`);
          setIsProcessing(false);
        }
      };

      processAIRequest();
    }
  }, [needsProcessing, type, query]);

  // Handle quiz option selection
  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
    setRevealedAnswers(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };

  const getTitle = () => {
    switch (type) {
      case 'explain':
        return `Explanation: ${query}`;
      case 'summarize':
        return 'Notes Summary';
      case 'quiz':
        return `Quiz: ${query}`;
      case 'flashcards':
        return 'Generated Flashcards';
      default:
        return 'AI Result';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'explain':
        return '📚';
      case 'summarize':
        return '📝';
      case 'quiz':
        return '🧠';
      case 'flashcards':
        return '📇';
      default:
        return '🤖';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-600">
                ChatBuddy
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-gray-700 font-medium">AI Results</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <button className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100">
                  ← Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Result Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{getIcon()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
              <p className="text-gray-600">Generated by AI Study Assistant</p>
            </div>
          </div>
        </div>

        {/* Result Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {isProcessing ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Your Content</h3>
              <p className="text-gray-600">AI is processing your request...</p>
            </div>
          ) : type === 'quiz' && Array.isArray(currentResult) ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Quiz</h2>
              {currentResult.map((q, qIndex) => {
                const selectedOption = selectedAnswers[qIndex];
                const isRevealed = revealedAnswers[qIndex];
                const isCorrect = selectedOption === q.correct;

                return (
                  <div key={qIndex} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-4">Question {qIndex + 1}: {q.question}</h3>
                    <div className="space-y-2">
                      {q.options.map((option, oIndex) => {
                        const isSelected = selectedOption === oIndex;
                        const isCorrectOption = oIndex === q.correct;
                        let optionClass = "flex items-center p-3 rounded-lg border cursor-pointer transition-all ";

                        if (isRevealed) {
                          if (isCorrectOption) {
                            optionClass += "bg-green-50 border-green-300 text-green-800";
                          } else if (isSelected && !isCorrectOption) {
                            optionClass += "bg-red-50 border-red-300 text-red-800";
                          } else {
                            optionClass += "bg-gray-50 border-gray-200 text-gray-500";
                          }
                        } else {
                          optionClass += isSelected
                            ? "bg-blue-50 border-blue-300 text-blue-800"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700";
                        }

                        return (
                          <div
                            key={oIndex}
                            className={optionClass}
                            onClick={() => !isRevealed && handleOptionSelect(qIndex, oIndex)}
                          >
                            <input
                              type="radio"
                              name={`quiz-${qIndex}`}
                              checked={isSelected}
                              onChange={() => !isRevealed && handleOptionSelect(qIndex, oIndex)}
                              className="mr-3"
                              disabled={isRevealed}
                            />
                            <label className="cursor-pointer flex-1">{option}</label>
                            {isRevealed && isCorrectOption && (
                              <span className="ml-2 text-green-600 font-bold">✓</span>
                            )}
                            {isRevealed && isSelected && !isCorrectOption && (
                              <span className="ml-2 text-red-600 font-bold">✗</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {isRevealed && (
                      <div className={`mt-4 p-3 rounded border-l-4 ${
                        isCorrect
                          ? 'bg-green-50 border-green-400'
                          : 'bg-blue-50 border-blue-400'
                      }`}>
                        <p className={`text-sm font-medium ${
                          isCorrect ? 'text-green-800' : 'text-blue-800'
                        }`}>
                          {isCorrect ? (
                            <>🎉 <strong>Correct!</strong> Great job!</>
                          ) : (
                            <>💡 <strong>Correct Answer:</strong> {q.options[q.correct]}</>
                          )}
                        </p>
                      </div>
                    )}

                    {!isRevealed && selectedOption !== undefined && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setRevealedAnswers(prev => ({ ...prev, [qIndex]: true }))}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Check Answer
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : type === 'flashcards' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Flashcards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  let flashcardsToRender = [];

                  if (Array.isArray(currentResult)) {
                    flashcardsToRender = currentResult;
                  } else if (typeof currentResult === 'string') {
                    // Try to parse string response into flashcards
                    const lines = currentResult.split('\n').filter(line => line.trim());
                    for (let i = 0; i < lines.length - 1; i += 2) {
                      if (lines[i] && lines[i + 1]) {
                        flashcardsToRender.push({
                          front: lines[i].replace(/^(Front:|Question:)/i, '').trim(),
                          back: lines[i + 1].replace(/^(Back:|Answer:)/i, '').trim()
                        });
                      }
                    }
                  }

                  // Fallback if no flashcards could be parsed
                  if (flashcardsToRender.length === 0) {
                    flashcardsToRender = [
                      { front: 'Flashcard generation in progress...', back: 'Please wait while we create your flashcards.' },
                      { front: 'Having trouble generating flashcards?', back: 'Try refreshing the page or using a different topic.' }
                    ];
                  }

                  return flashcardsToRender.map((card, index) => {
                  // Handle different possible data structures
                  const front = card.front || card.question || card.q || `Flashcard ${index + 1} (Front)`;
                  const back = card.back || card.answer || card.a || `Flashcard ${index + 1} (Back)`;

                  return (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <div className="font-semibold text-blue-900 mb-3 flex items-center">
                        <span className="mr-2">❓</span>
                        Question:
                      </div>
                      <div className="text-gray-800 mb-4 text-sm leading-relaxed">
                        {front}
                      </div>
                      <div className="border-t border-blue-200 pt-4">
                        <div className="font-semibold text-green-900 mb-2 flex items-center">
                          <span className="mr-2">✅</span>
                          Answer:
                        </div>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          {back}
                        </div>
                      </div>
                    </div>
                  );
                  });
                })()}
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {(() => {
                  // Ensure we never render objects directly
                  if (typeof currentResult === 'string') {
                    return currentResult;
                  } else if (typeof currentResult === 'object' && currentResult !== null) {
                    // This shouldn't happen for the default case, but handle it gracefully
                    console.warn('Unexpected object result for type:', type, currentResult);
                    return 'An error occurred while processing the result. Please try again.';
                  } else {
                    return String(currentResult || 'No result available');
                  }
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/dashboard">
            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium">
              Generate More Content
            </button>
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;