import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, activeTool, onToolSelect }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/dashboard',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'summarize',
      label: 'Summarize Notes',
      icon: '📝',
      path: '#summarize',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'quiz',
      label: 'Quiz Generator',
      icon: '🧠',
      path: '#quiz',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'explain',
      label: 'Explain Topic',
      icon: '📚',
      path: '#explain',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: '📇',
      path: '#flashcards',
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'chat',
      label: 'AI Chat',
      icon: '💬',
      path: '#chat',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'activity',
      label: 'Recent Activity',
      icon: '📊',
      path: '#activity',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleToolClick = (item) => {
    if (item.id !== 'dashboard') {
      // Scroll to the specific section
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      onToolSelect && onToolSelect(item.id);
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose && onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white shadow-2xl border-r border-gray-200 z-50
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-64'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">🤖</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">ChatBuddy</span>
            </div>
          )}

          {/* Collapse button - only on desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path ||
                              (item.path.startsWith('#') && activeTool === item.id);

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleToolClick(item)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                      }
                      ${isCollapsed ? 'justify-center px-2' : ''}
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center shadow-md
                      ${isActive
                        ? 'bg-white bg-opacity-20'
                        : `bg-gradient-to-br ${item.color}`
                      }
                    `}>
                      <span className={`text-sm ${isActive ? 'text-white' : 'text-white'}`}>
                        {item.icon}
                      </span>
                    </div>

                    {!isCollapsed && (
                      <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    )}

                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="mx-3 my-6 border-t border-gray-200"></div>

          {/* Quick Actions */}
          <div className="px-3">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${isCollapsed ? 'text-center' : ''}`}>
              {!isCollapsed ? 'Quick Actions' : '⚡'}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  // Scroll to top
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200
                  text-gray-600 hover:bg-gray-100 hover:text-indigo-600
                  ${isCollapsed ? 'justify-center px-2' : ''}
                `}
              >
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-200">
                  <span className="text-xs">⬆️</span>
                </div>
                {!isCollapsed && <span className="text-sm font-medium">Scroll to Top</span>}
              </button>

              <Link
                to="/settings"
                className={`
                  w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200
                  text-gray-600 hover:bg-gray-100 hover:text-indigo-600
                  ${isCollapsed ? 'justify-center px-2' : ''}
                `}
              >
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-200">
                  <span className="text-xs">⚙️</span>
                </div>
                {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {!isCollapsed ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                <span className="text-white text-lg">🚀</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">AI-Powered Learning</p>
              <p className="text-xs text-gray-500 mt-1">Study Smarter, Not Harder</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-sm">🚀</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;