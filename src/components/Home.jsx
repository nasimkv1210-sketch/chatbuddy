import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-800 text-white py-24 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full opacity-10 animate-spin" style={{animation: 'spin 30s linear infinite'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fade-in">
              🚀 AI-Powered Learning Assistant
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Master Any <span className="text-yellow-300">Subject</span> with AI
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-purple-100 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-200">
            Transform your learning experience with ChatBuddy's intelligent study tools.
            Get instant explanations, generate custom quizzes, create flashcards, and summarize complex topics with advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-400">
            <Link to="/dashboard">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 hover:-translate-y-1">
                🧠 Start Learning Now
              </button>
            </Link>
            <Link to="/signup">
              <button className="border-2 border-white/60 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105">
                Create Free Account
              </button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-purple-200 animate-fade-in delay-600">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Free AI Study Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>24/7 Learning Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Powerful AI Study Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in delay-200">
              Everything you need to excel in your studies with cutting-edge artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: Explain Topics */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Explain Any Topic</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Get clear, comprehensive explanations for complex subjects in simple, understandable language.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Instant Answers
                </span>
              </div>
            </div>

            {/* Feature 2: Generate Quizzes */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group animate-fade-in delay-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Custom Quizzes</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Create personalized quizzes with multiple choice questions tailored to your learning needs.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Smart Testing
                </span>
              </div>
            </div>

            {/* Feature 3: Flashcards */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group animate-fade-in delay-400">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">📇</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Smart Flashcards</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Generate effective flashcards with questions and answers optimized for better memorization.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Memory Boost
                </span>
              </div>
            </div>

            {/* Feature 4: Summarize Notes */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group animate-fade-in delay-600">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Note Summaries</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Transform lengthy notes and articles into concise, easy-to-understand summaries.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Time Saver
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
              Join Thousands of Successful Students
            </h2>
            <p className="text-xl text-indigo-100 animate-fade-in delay-200">
              Real results from students using ChatBuddy's AI study tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group animate-fade-in">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold text-yellow-300 mb-3 group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-indigo-100 font-medium">Active Learners</div>
                <div className="text-sm text-indigo-200 mt-2">Students using AI tools daily</div>
              </div>
            </div>

            <div className="text-center group animate-fade-in delay-200">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold text-green-300 mb-3 group-hover:scale-110 transition-transform duration-300">2M+</div>
                <div className="text-indigo-100 font-medium">AI Explanations</div>
                <div className="text-sm text-indigo-200 mt-2">Topics explained clearly</div>
              </div>
            </div>

            <div className="text-center group animate-fade-in delay-400">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold text-blue-300 mb-3 group-hover:scale-110 transition-transform duration-300">500K+</div>
                <div className="text-indigo-100 font-medium">Quizzes Generated</div>
                <div className="text-sm text-indigo-200 mt-2">Custom practice tests created</div>
              </div>
            </div>

            <div className="text-center group animate-fade-in delay-600">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold text-pink-300 mb-3 group-hover:scale-110 transition-transform duration-300">95%</div>
                <div className="text-indigo-100 font-medium">Satisfaction Rate</div>
                <div className="text-sm text-indigo-200 mt-2">Students love our AI tools</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-bounce delay-1000"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-bounce delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500 rounded-full opacity-20 animate-bounce delay-500"></div>
          <div className="absolute bottom-10 right-1/3 w-18 h-18 bg-indigo-500 rounded-full opacity-20 animate-bounce delay-1500"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8">
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-full font-bold text-sm mb-6 animate-fade-in">
              🚀 Start Your Learning Journey Today
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in delay-200">
            Transform Your Grades with
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Learning
            </span>
          </h2>

          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-400">
            Join thousands of students who are acing their exams with ChatBuddy's intelligent study assistant.
            Get personalized help, instant answers, and proven study techniques.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-600">
            <Link to="/signup">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 hover:-translate-y-1">
                🎓 Create Free Account
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="border-2 border-white/60 backdrop-blur-sm text-white hover:bg-white/10 px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105">
                Try AI Tools Now
              </button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center animate-fade-in delay-800">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold">Personalized Learning</div>
              <div className="text-sm text-gray-300 mt-1">Adaptive to your needs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Instant Answers</div>
              <div className="text-sm text-gray-300 mt-1">24/7 AI assistance</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-semibold">Better Grades</div>
              <div className="text-sm text-gray-300 mt-1">Proven results</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home