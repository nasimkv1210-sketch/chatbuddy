import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Authentication utilities
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const getUsers = () => {
  return JSON.parse(localStorage.getItem('chatbuddy_users') || '{}');
};

const saveUsers = (users) => {
  localStorage.setItem('chatbuddy_users', JSON.stringify(users));
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('chatbuddy_current_user') || 'null');
};

const setCurrentUser = (user) => {
  localStorage.setItem('chatbuddy_current_user', JSON.stringify(user));
};

const logout = () => {
  localStorage.removeItem('chatbuddy_current_user');
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const users = getUsers();
      const user = users[formData.email.toLowerCase()];

      if (!user) {
        setError('No account found with this email address.');
        setIsLoading(false);
        return;
      }

      // Hash the input password and compare
      const hashedPassword = await hashPassword(formData.password);

      if (user.passwordHash !== hashedPassword) {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Login successful - set current user and update profile
      setCurrentUser({
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName
      });

      // Update the user profile in localStorage
      const userProfile = {
        name: user.name,
        email: user.email
      };
      localStorage.setItem('chatbuddy_user_profile', JSON.stringify(userProfile));

      console.log('Login successful for:', user.email);

      // Dispatch auth change event to update navbar
      window.dispatchEvent(new Event('authChange'));

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400 via-red-400 to-orange-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full opacity-20 animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full opacity-20 animate-bounce delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full opacity-10" style={{animation: 'spin 25s linear infinite'}}></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-ping delay-300"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-ping delay-700"></div>
      <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-pink-400 rounded-full opacity-60 animate-ping delay-1000"></div>
      <div className="absolute bottom-20 right-20 w-4 h-4 bg-indigo-400 rounded-full opacity-60 animate-ping delay-1500"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Enhanced glassmorphism card with better styling */}
        <div className="backdrop-blur-2xl bg-white/90 border border-white/30 rounded-3xl shadow-2xl p-10 space-y-8 relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-3xl"></div>
          <div className="text-center relative z-10">
            {/* Enhanced Logo/Icon with animation */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-110 animate-pulse">
              <span className="text-3xl animate-bounce">🤖</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 animate-fade-in">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-base font-medium mb-6 animate-fade-in delay-200">
              Continue your AI-powered learning journey
            </p>
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-6 py-2 border border-blue-200/50 animate-fade-in delay-300">
              <span className="text-gray-600 text-sm">New here?</span>
              <Link
                to="/signup"
                className="ml-2 font-bold text-blue-600 hover:text-purple-600 transition-colors duration-300 hover:underline flex items-center"
              >
                Create Account
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 bg-white/70 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-900 text-base hover:border-blue-300 hover:bg-white/80"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 bg-white/70 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-900 text-base hover:border-purple-300 hover:bg-white/80"
                    placeholder="Your secure password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-purple-600 transition-colors duration-300 hover:underline"
                  onClick={() => alert('Password reset feature coming soon!')}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-5 px-8 border border-transparent text-base font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {isLoading ? (
                  <div className="flex items-center relative z-10">
                    <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg">Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center relative z-10">
                    <span className="text-lg mr-3">Sign In Securely</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                )}
              </button>
            </div>
        </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
                onClick={() => alert('Google login coming soon!')}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
                onClick={() => alert('Facebook login coming soon!')}
              >
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;