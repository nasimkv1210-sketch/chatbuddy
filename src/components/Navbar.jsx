import React from 'react';
import { Link } from 'react-router-dom';

const getUserInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const Navbar = () => {
  // Authentication bypassed - simplified navbar

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-2xl border-b border-purple-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <span className="text-white text-xl">🤖</span>
              </div>
              <span className="text-white text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                ChatBuddy
              </span>
            </Link>
          </div>
          <ul className="hidden md:flex space-x-2">
            <li>
              <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg group">
                <span className="group-hover:rotate-12 transition-transform duration-300">🏠</span>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <a href="#chat" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg group">
                <span className="group-hover:rotate-12 transition-transform duration-300">💬</span>
                <span>Chat</span>
              </a>
            </li>
            <li>
              <Link to="/contact" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg group">
                <span className="group-hover:rotate-12 transition-transform duration-300">📞</span>
                <span>Contact</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg group">
                <span className="group-hover:rotate-12 transition-transform duration-300">⚙️</span>
                <span>Settings</span>
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-3">
            {/* Always show dashboard access - authentication bypassed */}
            <Link to="/dashboard" className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                <span className="text-white text-sm font-bold">CB</span>
              </div>
              <div className="hidden lg:block">
                <div className="text-white text-sm font-semibold">ChatBuddy User</div>
                <div className="text-purple-200 text-xs">Dashboard</div>
              </div>
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden text-white hover:text-purple-200 transition-colors duration-300 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;