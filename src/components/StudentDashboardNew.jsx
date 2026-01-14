import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponses, setAiResponses] = useState([]);
  const [studyNotes, setStudyNotes] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Mock AI Assistant Functions
  const mockAIResponses = {
    explain: (topic) => {
      const explanations = {
        'calculus': "Calculus is the mathematical study of continuous change. Think of it like analyzing how things move and change over time. The two main branches are:\n\n1. **Differential Calculus**: Studies rates of change and slopes of curves\n2. **Integral Calculus**: Deals with accumulation and areas under curves\n\nExample: If you're driving a car, differential calculus helps you understand speed (how fast you're going), while integral calculus helps you understand distance traveled (how far you've gone).",
        'physics': "Physics is the fundamental science that studies matter, energy, and their interactions. It's divided into:\n\n1. **Classical Physics**: Mechanics, thermodynamics, electromagnetism\n2. **Modern Physics**: Quantum mechanics, relativity, particle physics\n\nThink of physics as the 'why' behind how the universe works - from why apples fall to how stars shine.",
        'programming': "Programming is giving instructions to computers to solve problems. Key concepts:\n\n1. **Algorithms**: Step-by-step procedures to solve problems\n2. **Data Structures**: Ways to organize and store data efficiently\n3. **Logic**: Making decisions and controlling program flow\n\nIt's like writing a recipe - you need to be precise about ingredients (data) and steps (instructions).",
        'default': "I'd be happy to help explain that topic! Could you provide more specific details about what aspect you'd like me to clarify? For example, are you looking for:\n\n• Basic concepts and definitions\n• Step-by-step explanations\n• Real-world examples\n• Practice problems\n• Related topics"
      };
      return explanations[topic.toLowerCase()] || explanations.default;
    },

    summarize: (notes) => {
      return `📝 **Summary of Your Notes:**

**Key Points:**
• ${notes.split('.').slice(0, 3).join('.\n• ')}

**Main Concepts:**
- Extracted the core ideas from your study material
- Organized information for better understanding
- Highlighted important relationships between concepts

**Study Tips:**
- Focus on the connections between different ideas
- Practice applying these concepts to real problems
- Review regularly to reinforce understanding`;
    },

    generateQuiz: (topic) => {
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
    },

    generateFlashcards: (topic) => {
      return [
        { front: `What is ${topic}?`, back: `A fundamental concept in the study of ${topic.toLowerCase()}.` },
        { front: `Key principle of ${topic}`, back: `Understanding the core relationships and applications.` },
        { front: `Real-world application`, back: `${topic} is used in various practical scenarios.` },
        { front: `Why study ${topic}?`, back: `To understand fundamental concepts and their applications.` }
      ];
    }
  };

  const handleAIQuestion = async (type, content) => {
    setIsAiTyping(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response = '';
    switch(type) {
      case 'explain':
        response = mockAIResponses.explain(content);
        break;
      case 'summarize':
        response = mockAIResponses.summarize(content);
        break;
      case 'quiz':
        const quizData = mockAIResponses.generateQuiz(content);
        setAiResponses(prev => [...prev, {
          type: 'quiz',
          content: `I've generated a quiz on "${content}". Here are 3 questions:`,
          quiz: quizData,
          timestamp: new Date().toLocaleTimeString()
        }]);
        setIsAiTyping(false);
        return;
      case 'flashcards':
        const cards = mockAIResponses.generateFlashcards(content);
        setFlashcards(cards);
        setAiResponses(prev => [...prev, {
          type: 'flashcards',
          content: `I've created ${cards.length} flashcards on "${content}". Check the flashcards section below!`,
          timestamp: new Date().toLocaleTimeString()
        }]);
        setIsAiTyping(false);
        return;
      default:
        response = "I'm here to help! Try asking me to explain a topic, summarize notes, or generate quizzes/flashcards.";
    }

    setAiResponses(prev => [...prev, {
      type,
      content: response,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setIsAiTyping(false);
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <span className="text-gray-700 font-medium">John Doe</span>
              </div>
              <Link to="/login">
                <button className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md text-sm font-medium transition-colors">
                  Logout
                </button>
              </Link>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
            />
            <button
              onClick={() => handleAIQuestion('flashcards', 'mathematics')}
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

            <div className="h-96 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
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

              <div className="p-4 border-t bg-gray-50">
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
                {[
                  { id: 1, type: 'assignment', title: 'Completed Calculus Homework', time: '2 hours ago', icon: '📝' },
                  { id: 2, type: 'chat', title: 'Joined Physics Study Group', time: '4 hours ago', icon: '💬' },
                  { id: 3, type: 'quiz', title: 'Scored 95% on Math Quiz', time: '1 day ago', icon: '🧠' },
                  { id: 4, type: 'note', title: 'Saved Chemistry Notes', time: '2 days ago', icon: '📚' }
                ].map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
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

        {/* Saved Content / Library */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📚 Saved Content / Library</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 1, type: 'note', title: 'Organic Chemistry Reactions', subject: 'Chemistry', date: '2024-01-10' },
              { id: 2, type: 'flashcard', title: 'Spanish Vocabulary Set', subject: 'Language', date: '2024-01-08' },
              { id: 3, type: 'quiz', title: 'Physics Midterm Review', subject: 'Physics', date: '2024-01-05' },
              { id: 4, type: 'summary', title: 'World History Chapter 5', subject: 'History', date: '2024-01-03' },
              { id: 5, type: 'note', title: 'Calculus Formulas', subject: 'Mathematics', date: '2024-01-01' },
              { id: 6, type: 'quiz', title: 'Biology Cell Structure', subject: 'Biology', date: '2023-12-28' }
            ].map((content) => (
              <div key={content.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    content.type === 'note' ? 'bg-blue-100 text-blue-800' :
                    content.type === 'flashcard' ? 'bg-green-100 text-green-800' :
                    content.type === 'quiz' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {content.type}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{content.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{content.subject}</p>
                <p className="text-xs text-gray-500">Saved {content.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;