import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';

// Utility functions for tracking user statistics
const getUserStats = () => {
  const stats = JSON.parse(localStorage.getItem('chatbuddy_stats') || '{}');
  return {
    studySessions: stats.studySessions || 0,
    aiInteractions: stats.aiInteractions || 0,
    topicsLearned: stats.topicsLearned || [],
    dailyActivity: stats.dailyActivity || {},
    lastActivityDate: stats.lastActivityDate || null,
    recentActivities: stats.recentActivities || []
  };
};

const updateUserStats = (updates) => {
  const currentStats = getUserStats();
  const newStats = { ...currentStats, ...updates };
  localStorage.setItem('chatbuddy_stats', JSON.stringify(newStats));
  return newStats;
};

const recordAIInteraction = (type, topic) => {
  const stats = getUserStats();
  const today = new Date().toDateString();
  const now = new Date();

  // Create activity entry
  const activityEntry = {
    id: Date.now(),
    type: type,
    title: getActivityTitle(type, topic),
    time: now.toISOString(),
    icon: getActivityIcon(type)
  };

  // Record AI interaction
  const updatedStats = updateUserStats({
    aiInteractions: stats.aiInteractions + 1,
    dailyActivity: {
      ...stats.dailyActivity,
      [today]: (stats.dailyActivity[today] || 0) + 1
    },
    lastActivityDate: today,
    recentActivities: [activityEntry, ...(stats.recentActivities || [])].slice(0, 10) // Keep only last 10 activities
  });

  // Track unique topics
  if (topic && !stats.topicsLearned.includes(topic.toLowerCase())) {
    const newTopics = [...stats.topicsLearned, topic.toLowerCase()];
    updateUserStats({ topicsLearned: newTopics });
  }

  return updatedStats;
};

const getActivityTitle = (type, topic) => {
  switch(type) {
    case 'explain':
      return `Explained topic: "${topic}"`;
    case 'summarize':
      return `Summarized notes on: "${topic}"`;
    case 'quiz':
      return `Generated quiz on: "${topic}"`;
    case 'flashcards':
      return `Created flashcards for: "${topic}"`;
    default:
      return `Used AI tool: ${type}`;
  }
};

const getActivityIcon = (type) => {
  switch(type) {
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

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMs = now - activityTime;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  return activityTime.toLocaleDateString();
};

const recordStudySession = () => {
  const stats = getUserStats();
  const today = new Date().toDateString();

  // Only count one study session per day
  if (stats.lastActivityDate !== today) {
    updateUserStats({
      studySessions: stats.studySessions + 1,
      lastActivityDate: today
    });
  }
};

const calculateStudyStreak = () => {
  const stats = getUserStats();
  const dailyActivity = stats.dailyActivity;
  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);

  // Check consecutive days backwards from today
  while (true) {
    const dateStr = checkDate.toDateString();
    if (dailyActivity[dateStr] && dailyActivity[dateStr] > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// User profile management functions
const getUserProfile = () => {
  const profile = JSON.parse(localStorage.getItem('chatbuddy_user_profile') || '{}');
  return {
    name: profile.name || 'John Doe',
    email: profile.email || 'user@chatbuddy.com'
  };
};



const logout = () => {
  localStorage.removeItem('chatbuddy_current_user');
  // Keep user profile for next login, but clear session
  // Dispatch auth change event to update navbar
  window.dispatchEvent(new Event('authChange'));
};

const StudentDashboard = () => {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponses, setAiResponses] = useState([]);
  const [studyNotes, setStudyNotes] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [flashcards, setFlashcards] = useState([]);


  // Real-time statistics state
  const [stats, setStats] = useState({
    studySessions: 0,
    aiInteractions: 0,
    topicsLearned: 0,
    studyStreak: 0
  });
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Check if OpenAI API key is configured
  const apiKeyValue = import.meta.env.VITE_OPENAI_API_KEY;
  const isAIConfigured = !!apiKeyValue && apiKeyValue !== 'your_openai_api_key_here';

  // Ref for auto-scrolling chat
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [aiResponses, isAiTyping]);

  // Load and update real statistics
  useEffect(() => {
    const loadStats = () => {
      const userStats = getUserStats();
      const streak = calculateStudyStreak();

      setStats({
        studySessions: userStats.studySessions,
        aiInteractions: userStats.aiInteractions,
        topicsLearned: userStats.topicsLearned.length,
        studyStreak: streak
      });
    };

    // Load initial stats
    loadStats();

    // Record study session on dashboard visit
    recordStudySession();

    // Refresh stats after a short delay to ensure localStorage is updated
    const timer = setTimeout(loadStats, 100);

    return () => clearTimeout(timer);
  }, []);


  // AI Service Functions - Now using real AI API
  const aiServiceFunctions = {
    explain: async (topic) => {
      try {
        return await aiService.explainTopic(topic);
      } catch (error) {
        console.error('AI explanation error:', error);
        return `I'm sorry, I couldn't explain "${topic}" right now. Please check your internet connection and try again. If the problem persists, make sure your OpenRouter API key is configured correctly in the .env file.`;
      }
    },

    summarize: async (notes) => {
      try {
        return await aiService.summarizeNotes(notes);
      } catch (error) {
        console.error('AI summarization error:', error);
        return `I'm sorry, I couldn't summarize your notes right now. Please check your internet connection and try again. If the problem persists, make sure your OpenRouter API key is configured correctly in the .env file.`;
      }
    },

    generateQuiz: async (topic) => {
      try {
        return await aiService.generateQuiz(topic);
      } catch (error) {
        console.error('AI quiz generation error:', error);
        // Return a fallback quiz structure
        return [
          {
            question: `What is the fundamental principle of ${topic}?`,
            options: ["Basic concept A", "Basic concept B", "Basic concept C", "Basic concept D"],
            correct: 0
          },
          {
            question: `How does ${topic} relate to real-world applications?`,
            options: ["Direct application", "Indirect application", "No application", "Theoretical only"],
            correct: 1
          },
          {
            question: `What are the key components of ${topic}?`,
            options: ["Single component", "Multiple components", "No components", "Variable components"],
            correct: 1
          }
        ];
      }
    },

    generateFlashcards: async (topic) => {
      try {
        return await aiService.generateFlashcards(topic);
      } catch (error) {
        console.error('AI flashcard generation error:', error);
        // Return fallback flashcards
        return [
          { front: `What is ${topic}?`, back: `A fundamental concept in the study of ${topic.toLowerCase()}.` },
          { front: `Key principle of ${topic}`, back: `Understanding the core relationships and applications.` },
          { front: `Real-world application`, back: `${topic} is used in various practical scenarios.` },
          { front: `Why study ${topic}?`, back: `To understand fundamental concepts and their applications.` }
        ];
      }
    }
  };

  const handleAIQuestion = (type, content) => {
    // Record AI interaction immediately
    recordAIInteraction(type, content);

    // Update stats display
    const userStats = getUserStats();
    const streak = calculateStudyStreak();
    setStats({
      studySessions: userStats.studySessions,
      aiInteractions: userStats.aiInteractions,
      topicsLearned: userStats.topicsLearned.length,
      studyStreak: streak
    });

    // Truly instant navigation - no async operations
    navigate('/results', {
      state: {
        type,
        query: content,
        needsProcessing: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                ChatBuddy
              </Link>
              <span className="text-gray-500">|</span>
              <span className="text-gray-700 font-medium">AI Study Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* AI Tutor / Help Button */}
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <span>🤖</span>
                <span>AI Tutor</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-3">Welcome to AI Study Hub! 🎓</h1>
          <p className="text-blue-100 text-lg">Your intelligent study companion powered by AI</p>
        </div>

        {/* AI Configuration Warning */}
        {!isAIConfigured && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>AI Features Not Configured:</strong> To use AI-powered study tools, you need to set up your OpenRouter API key.
                  Check the <code className="bg-yellow-100 px-1 rounded">AI_SETUP.md</code> file for instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Study Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Summarize Notes */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Summarize Notes</h3>
            </div>
            <p className="text-gray-600 mb-4">Paste your study notes and get instant summaries with key points</p>
            <textarea
              placeholder="Paste your study notes here..."
              value={studyNotes}
              onChange={(e) => setStudyNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3 h-24 resize-none"
            />
            <button
              onClick={() => {
                if (studyNotes.trim()) {
                  handleAIQuestion('summarize', studyNotes);
                  setStudyNotes('');
                }
              }}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Summarize Notes
            </button>
          </div>

          {/* Quiz Generator */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Quiz Generator</h3>
            </div>
            <p className="text-gray-600 mb-4">Generate custom quizzes on any topic to test your knowledge</p>
            <input
              type="text"
              placeholder="e.g., biology, algebra, history..."
              value={quizTopic}
              onChange={(e) => setQuizTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
            />
            <button
              onClick={() => {
                if (quizTopic.trim()) {
                  handleAIQuestion('quiz', quizTopic);
                  setQuizTopic('');
                }
              }}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Generate Quiz
            </button>
          </div>

          {/* Explain a Topic */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Explain a Topic</h3>
            </div>
            <p className="text-gray-600 mb-4">Get complex topics explained in simple, easy-to-understand terms</p>
            <input
              type="text"
              placeholder="e.g., photosynthesis, quantum physics..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            <button
              onClick={() => {
                if (aiQuestion.trim()) {
                  handleAIQuestion('explain', aiQuestion);
                  setAiQuestion('');
                }
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Explain Topic
            </button>
          </div>

          {/* Flashcards Generator */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">📇</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Flashcards Generator</h3>
            </div>
            <p className="text-gray-600 mb-4">Create flashcards automatically for effective memorization</p>
            <input
              type="text"
              placeholder="e.g., Spanish vocabulary, math formulas..."
              value={flashcardTopic}
              onChange={(e) => setFlashcardTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
            />
            <button
              onClick={() => {
                if (flashcardTopic.trim()) {
                  handleAIQuestion('flashcards', flashcardTopic);
                  setFlashcardTopic('');
                }
              }}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Generate Flashcards
            </button>
          </div>
        </div>

        {/* AI Chat Interface & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Chat Interface */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🤖</span>
                AI Study Assistant
              </h3>
              <p className="text-sm text-gray-600">Get instant help with your studies</p>
            </div>

            <div className="h-[600px] flex flex-col">
              <div
                ref={chatContainerRef}
                className="flex-1 p-6 overflow-y-auto space-y-4"
              >
                {aiResponses.length === 0 && !isAiTyping && (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <p className="text-lg font-medium mb-2">Hello! I'm your AI Study Assistant</p>
                    <p className="text-sm">I can help you:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Explain complex topics in simple terms</li>
                      <li>• Summarize your study notes</li>
                      <li>• Generate quizzes and flashcards</li>
                      <li>• Answer questions about any subject</li>
                    </ul>
                  </div>
                )}

                {aiResponses.map((response, index) => (
                  <div key={index} className="flex justify-start">
                    <div className="max-w-lg">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <span className="text-blue-600 mr-2">🤖</span>
                          <span className="text-xs text-gray-500">{response.timestamp}</span>
                        </div>
                        <div className="text-gray-900 whitespace-pre-line text-sm">
                          {response.content}
                        </div>
                        {response.type === 'quiz' && response.quiz && (
                          <div className="mt-4 space-y-3">
                            {response.quiz.map((q, qIndex) => (
                              <div key={qIndex} className="bg-white p-3 rounded border">
                                <p className="font-medium text-sm mb-2">{q.question}</p>
                                <div className="space-y-1">
                                  {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center">
                                      <input
                                        type="radio"
                                        name={`quiz-${qIndex}`}
                                        className="mr-2"
                                      />
                                      <label className="text-sm">{option}</label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-xs">
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-2">🤖</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Explain derivatives",
                    "Summarize chapter 5",
                    "Quiz me on biology",
                    "Create math flashcards"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const type = suggestion.includes('Explain') ? 'explain' :
                                   suggestion.includes('Summarize') ? 'summarize' :
                                   suggestion.includes('Quiz') ? 'quiz' : 'flashcards';
                        const topic = suggestion.split(' ').slice(-1)[0];
                        handleAIQuestion(type, topic);
                      }}
                      className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs border hover:bg-gray-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {(() => {
                  const userStats = getUserStats();
                  const activities = userStats.recentActivities.length > 0
                    ? userStats.recentActivities.slice(0, 4).map(activity => ({
                        ...activity,
                        time: getRelativeTime(activity.time)
                      }))
                    : [
                        { id: 1, type: 'welcome', title: 'Welcome to ChatBuddy! Start by using our AI tools.', time: 'Just now', icon: '🎉' },
                        { id: 2, type: 'info', title: 'Try explaining a topic or generating a quiz.', time: 'Getting started', icon: '💡' }
                      ];

                  return activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Flashcards Display */}
            {flashcards.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📇 Generated Flashcards</h3>
                <div className="grid grid-cols-1 gap-3">
                  {flashcards.map((card, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        <strong>Q:</strong> {card.front}
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>A:</strong> {card.back}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setFlashcards([])}
                  className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Clear Flashcards
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;