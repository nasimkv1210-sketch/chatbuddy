import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Authentication utilities (same as Login/Signup)
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('chatbuddy_current_user') || 'null');
};

const getUserProfile = () => {
  const profile = JSON.parse(localStorage.getItem('chatbuddy_user_profile') || '{}');
  return {
    name: profile.name || 'John Doe',
    email: profile.email || 'user@chatbuddy.com'
  };
};

const getUserInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const logout = () => {
  localStorage.removeItem('chatbuddy_current_user');
};

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ name: 'John Doe', email: 'user@chatbuddy.com' });

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const updateAuthStatus = () => {
      const user = getCurrentUser();
      const profile = getUserProfile();
      setCurrentUser(user);
      setUserProfile(profile);
    };

    updateAuthStatus();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      updateAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for when login/logout happens in the same tab
    const handleAuthChange = () => {
      updateAuthStatus();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    // Dispatch custom event to update other components
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

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
            {currentUser ? (
              // User is logged in - show profile and logout
              <>
                <Link to="/dashboard" className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                    <span className="text-white text-sm font-bold">{getUserInitials(userProfile.name)}</span>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-white text-sm font-semibold">{userProfile.name}</div>
                    <div className="text-purple-200 text-xs">Dashboard</div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center space-x-2"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              // User is not logged in - show login button
              <Link to="/login">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2">
                  <span>🔐</span>
                  <span>Sign In</span>
                </button>
              </Link>
            )}

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