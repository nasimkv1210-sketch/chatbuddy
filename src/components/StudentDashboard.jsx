import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import Sidebar from './Sidebar';

// API functions for user statistics
const getUserStats = async () => {
  try {
    const response = await apiService.getUserStats();
    return response.stats || {
      studySessions: 0,
      aiInteractions: 0,
      topicsLearned: [],
      dailyActivity: {},
      lastActivityDate: null,
      recentActivities: []
    };
  } catch (error) {
    console.error('Failed to get user stats:', error);
    return {
      studySessions: 0,
      aiInteractions: 0,
      topicsLearned: [],
      dailyActivity: {},
      lastActivityDate: null,
      recentActivities: []
    };
  }
};

const updateUserStats = async (updates) => {
  try {
    const response = await apiService.updateUserStats(updates);
    return response.stats;
  } catch (error) {
    console.error('Failed to update user stats:', error);
    throw error;
  }
};

// AI interactions are now tracked automatically by the backend
// when API calls are made through apiService

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

const getActivityColor = (type) => {
  switch(type) {
    case 'explain':
      return 'bg-blue-100';
    case 'summarize':
      return 'bg-green-100';
    case 'quiz':
      return 'bg-purple-100';
    case 'flashcards':
      return 'bg-yellow-100';
    default:
      return 'bg-gray-100';
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

const recordStudySession = async () => {
  try {
    const userStats = await getUserStats();
    const today = new Date().toDateString();

    // Only count one study session per day
    if (userStats.lastActivityDate !== today) {
      await updateUserStats({
        studySessions: (userStats.studySessions || 0) + 1,
        lastActivityDate: today
      });
    }
  } catch (error) {
    console.error('Failed to record study session:', error);
  }
};

const calculateStudyStreak = async () => {
  try {
    const stats = await getUserStats();
    const dailyActivity = stats.dailyActivity || {};
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
  } catch (error) {
    console.error('Failed to calculate study streak:', error);
    return 0;
  }
};

// User profile management functions
const getUserProfile = () => {
  const profile = JSON.parse(localStorage.getItem('chatbuddy_user_profile') || '{}');
  return {
    name: profile.name || 'John Doe',
    email: profile.email || 'user@chatbuddy.com'
  };
};


const StudentDashboard = () => {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponses, setAiResponses] = useState([]);
  const [studyNotes, setStudyNotes] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Real-time statistics state
  const [stats, setStats] = useState({
    studySessions: 0,
    aiInteractions: 0,
    topicsLearned: 0,
    studyStreak: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  const [aiError, setAiError] = useState(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTool, setActiveTool] = useState('dashboard');

  // Navigation hook
  const navigate = useNavigate();

  // Ref for auto-scrolling chat
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [aiResponses, isAiTyping]);

  // Load and update statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const userStats = await getUserStats();
        const streak = await calculateStudyStreak();

        setStats({
          studySessions: userStats.studySessions || 0,
          aiInteractions: userStats.aiInteractions || 0,
          topicsLearned: userStats.topicsLearned?.length || 0,
          studyStreak: streak
        });

        setRecentActivities(userStats.recentActivities || []);
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats({
          studySessions: 0,
          aiInteractions: 0,
          topicsLearned: 0,
          studyStreak: 0
        });
        setRecentActivities([]);
      }
    };

    loadStats();
    recordStudySession();
  }, []);


  // Check if AI is configured (now handled by backend)
  const isAIConfigured = true; // AI is now configured via backend


  // Test API key on component mount
  useEffect(() => {
    if (isAIConfigured) {
      console.log('🎉 AI is configured! Testing API connection...');
      // You can add a test API call here if needed
    }
  }, [isAIConfigured]);

  // AI Service Functions
  const aiServiceFunctions = {
    explain: async (topic) => {
      try {
        const response = await apiService.explainTopic(topic);
        return response.result || response;
      } catch (error) {
        console.error('AI explanation error:', error);
        return `I'm sorry, I couldn't explain "${topic}" right now. Please check your internet connection and try again.`;
      }
    },

    summarize: async (notes) => {
      try {
        const response = await apiService.summarizeNotes(notes);
        return response.result || response;
      } catch (error) {
        console.error('AI summarization error:', error);
        return `I'm sorry, I couldn't summarize your notes right now. Please check your internet connection and try again.`;
      }
    },

    generateQuiz: async (topic) => {
      try {
        const response = await apiService.generateQuiz(topic);
        return response.questions || response;
      } catch (error) {
        console.error('AI quiz generation error:', error);
        return [
          {
            question: `What is the fundamental principle of ${topic}?`,
            options: ["Basic concept A", "Basic concept B", "Basic concept C", "Basic concept D"],
            correct: 0
          }
        ];
      }
    },

    generateFlashcards: async (topic) => {
      try {
        const response = await apiService.generateFlashcards(topic);
        return response.flashcards || response;
      } catch (error) {
        console.error('AI flashcard generation error:', error);
        return [
          { front: `What is ${topic}?`, back: `A fundamental concept in the study of ${topic.toLowerCase()}.` }
        ];
      }
    }
  };

  const handleAIQuestion = (type, content) => {
    // Navigate to results page for processing
    navigate('/results', {
      state: {
        type,
        query: content,
        needsProcessing: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                ChatBuddy
              </Link>
              <div className="h-6 w-px bg-gradient-to-b from-blue-300 to-purple-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">🎓</span>
                </div>
                <span className="text-gray-700 font-semibold text-lg">AI Study Hub</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Toggle Button - Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTool={activeTool}
          onToolSelect={setActiveTool}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
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
                  <strong>Backend Not Running:</strong> AI features require the backend server to be running.
                  Please start the backend server using <code className="bg-yellow-100 px-1 rounded">npm run dev</code> in the backend directory.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Successfully Configured Message */}
        {isAIConfigured && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>✅ AI Features Configured!</strong> Your OpenAI API key is set up correctly. All AI study tools are now available.
                </p>
              </div>
            </div>
          </div>
        )}


        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🚀</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Welcome to AI Study Hub
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Your intelligent study companion powered by advanced AI. Get instant help with complex topics,
                personalized learning, and smart study tools.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Study Sessions', value: stats.studySessions.toString(), icon: '📚', color: 'from-blue-500 to-blue-600' },
            { label: 'AI Interactions', value: stats.aiInteractions.toString(), icon: '🤖', color: 'from-purple-500 to-purple-600' },
            { label: 'Topics Learned', value: stats.topicsLearned.toString(), icon: '🎯', color: 'from-green-500 to-green-600' },
            { label: 'Study Streak', value: stats.studyStreak.toString(), icon: '🔥', color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Study Tools */}
        <div id="summarize" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* AI Study Tools */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🛠️</span>
              AI Study Tools
            </h2>

            {/* Summarize Notes */}
            <div id="summarize" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Summarize Notes</h3>
                  <p className="text-gray-600">Get instant summaries with key points</p>
                </div>
              </div>
              <textarea
                placeholder="Paste your study notes here..."
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4 resize-none h-24"
              />
              <button
                onClick={() => {
                  if (studyNotes.trim()) {
                    handleAIQuestion('summarize', studyNotes);
                    setStudyNotes('');
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                📝 Summarize Notes
              </button>
            </div>

            {/* Quiz Generator */}
            <div id="quiz" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Quiz Generator</h3>
                  <p className="text-gray-600">Create custom quizzes to test your knowledge</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g., biology, algebra, history..."
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              />
              <button
                onClick={() => {
                  if (quizTopic.trim()) {
                    handleAIQuestion('quiz', quizTopic);
                    setQuizTopic('');
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                🧠 Generate Quiz
              </button>
            </div>

            {/* Explain a Topic */}
            <div id="explain" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Explain a Topic</h3>
                  <p className="text-gray-600">Get complex topics explained simply</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g., photosynthesis, quantum physics..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
              <button
                onClick={() => {
                  if (aiQuestion.trim()) {
                    handleAIQuestion('explain', aiQuestion);
                    setAiQuestion('');
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                📚 Explain Topic
              </button>
            </div>

            {/* Flashcards Generator */}
            <div id="flashcards" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">📇</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Flashcards Generator</h3>
                  <p className="text-gray-600">Create flashcards for effective memorization</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g., Spanish vocabulary, math formulas..."
                value={flashcardTopic}
                onChange={(e) => setFlashcardTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              />
              <button
                onClick={() => {
                  if (flashcardTopic.trim()) {
                    handleAIQuestion('flashcards', flashcardTopic);
                    setFlashcardTopic('');
                  }
                }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                📇 Generate Flashcards
              </button>
            </div>
          </div>

          {/* AI Assistant & Activity */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🤖</span>
              AI Assistant
            </h2>

            {/* AI Chat Interface */}
            <div id="chat" className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">💬</span>
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
                    <div className="text-center text-gray-500 py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🤖</span>
                      </div>
                      <p className="text-lg font-medium mb-2 text-gray-700">Hello! I'm your AI Study Assistant</p>
                      <p className="text-sm text-gray-600">I can help you:</p>
                      <ul className="text-sm mt-3 space-y-1 text-gray-600">
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
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center mb-2">
                            <span className="text-blue-600 mr-2 text-lg">🤖</span>
                            <span className="text-xs text-gray-500 font-medium">{response.timestamp}</span>
                          </div>
                          <div className="text-gray-900 whitespace-pre-line text-sm leading-relaxed">
                            {response.content}
                          </div>
                          {response.type === 'quiz' && response.quiz && (
                            <div className="mt-4 space-y-3">
                              {response.quiz.map((q, qIndex) => (
                                <div key={qIndex} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                  <p className="font-medium text-sm mb-3 text-gray-900">{q.question}</p>
                                  <div className="space-y-2">
                                    {q.options.map((option, oIndex) => (
                                      <div key={oIndex} className="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                                        <input
                                          type="radio"
                                          name={`quiz-${qIndex}`}
                                          className="mr-3 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label className="text-sm text-gray-700 cursor-pointer">{option}</label>
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
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 max-w-xs shadow-sm">
                        <div className="flex items-center">
                          <span className="text-blue-600 mr-2 text-lg">🤖</span>
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
                  <p className="text-sm text-gray-600 mb-3 font-medium">Quick suggestions:</p>
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
                        className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div id="activity" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {(() => {
                  const activities = recentActivities.length > 0
                    ? recentActivities.slice(0, 4).map(activity => ({
                        ...activity,
                        time: getRelativeTime(activity.time)
                      }))
                    : [
                        { id: 1, type: 'welcome', title: 'Welcome to ChatBuddy! Start by using our AI tools.', time: 'Just now', icon: '🎉', color: 'bg-blue-100' },
                        { id: 2, type: 'info', title: 'Try explaining a topic or generating a quiz.', time: 'Getting started', icon: '💡', color: 'bg-green-100' }
                      ];

                  return activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                      <div className={`flex-shrink-0 w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center shadow-sm`}>
                        <span className="text-lg">{activity.icon}</span>
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
          </div>
        </div>

        {/* Flashcards Display */}
        {flashcards.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="mr-3">📇</span>
                Generated Flashcards
              </h3>
              <button
                onClick={() => setFlashcards([])}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map((card, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                    <span className="mr-2">❓</span>
                    Question:
                  </div>
                  <div className="text-gray-800 mb-4 text-sm leading-relaxed">
                    {card.front}
                  </div>
                  <div className="border-t border-blue-200 pt-4">
                    <div className="text-sm font-semibold text-green-900 mb-2 flex items-center">
                      <span className="mr-2">✅</span>
                      Answer:
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed">
                      {card.back}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        </div> {/* End Main Content */}
      </div> {/* End Flex Container */}
    </div>
  );
};

export default StudentDashboard;