import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white py-10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full -translate-x-20 -translate-y-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full translate-x-20 translate-y-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-indigo-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  ChatBuddy
                </h3>
                <div className="text-xs text-blue-200 font-medium">AI Study Assistant</div>
              </div>
            </div>
            <p className="text-gray-200 mb-6 max-w-md text-sm leading-relaxed">
              Revolutionizing education with AI-powered learning tools. Master any subject with intelligent explanations, custom quizzes, and smart study companions.
            </p>

            {/* Social Links with Glassmorphism */}
            <div className="flex space-x-3">
              <a
                href="https://twitter.com/chatbuddyai"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/chatbuddy"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                aria-label="Connect with us on LinkedIn"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:support@chatbuddy.ai"
                className="group w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/25"
                aria-label="Send us an email"
              >
                <svg className="w-5 h-5 group-hover:bounce transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent flex items-center">
              <span className="text-blue-400 mr-2">🔗</span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="group flex items-center text-gray-200 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="font-medium">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group flex items-center text-gray-200 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="font-medium">Study Tools</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group flex items-center text-gray-200 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="font-medium">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent flex items-center">
              <span className="text-purple-400 mr-2">🛠️</span>
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/settings" className="group flex items-center text-gray-200 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="font-medium">Help Center</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => alert('Privacy Policy coming soon!')}
                  className="group flex items-center text-gray-200 hover:text-white transition-all duration-300 hover:translate-x-1 w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="font-medium">Privacy Policy</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Glassmorphism */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              {/* Stats with Enhanced Design */}
              <div className="flex space-x-8 mb-6 lg:mb-0">
                <div className="text-center group">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    50K+
                  </div>
                  <div className="text-xs text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                    Active Learners
                  </div>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                <div className="text-center group">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    2M+
                  </div>
                  <div className="text-xs text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                    AI Interactions
                  </div>
                </div>
              </div>

              {/* Copyright with Heart Animation */}
              <div className="text-center lg:text-center">
                <p className="text-gray-200 text-sm flex items-center justify-center lg:justify-center">
                  © 2025 ChatBuddy. Made with
                  <span className="inline-block mx-1 animate-pulse text-red-400">❤️</span>
                  for better learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer