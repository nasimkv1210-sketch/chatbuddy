import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Authentication utilities (same as Login)
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

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const users = getUsers();
      const email = formData.email.toLowerCase();

      // Check if user already exists
      if (users[email]) {
        setError('An account with this email already exists.');
        setIsLoading(false);
        return;
      }

      // Hash the password
      const passwordHash = await hashPassword(formData.password);

      // Create new user
      const newUser = {
        email: email,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString()
      };

      // Save user
      users[email] = newUser;
      saveUsers(users);

      console.log('Account created successfully for:', email);

      // Auto-login after registration
      localStorage.setItem('chatbuddy_current_user', JSON.stringify({
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }));

      // Set user profile
      const userProfile = {
        name: newUser.name,
        email: newUser.email
      };
      localStorage.setItem('chatbuddy_user_profile', JSON.stringify(userProfile));

      // Dispatch auth change event to update navbar
      window.dispatchEvent(new Event('authChange'));

      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-300 to-green-400 rounded-full opacity-20 animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full opacity-20 animate-bounce delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200 to-green-300 rounded-full opacity-10" style={{animation: 'spin 25s linear infinite'}}></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-green-400 rounded-full opacity-60 animate-ping delay-300"></div>
      <div className="absolute top-40 left-32 w-3 h-3 bg-emerald-400 rounded-full opacity-60 animate-ping delay-700"></div>
      <div className="absolute bottom-32 right-1/4 w-5 h-5 bg-teal-400 rounded-full opacity-60 animate-ping delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-ping delay-1500"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Enhanced glassmorphism card with better styling */}
        <div className="backdrop-blur-2xl bg-white/90 border border-white/30 rounded-3xl shadow-2xl p-10 relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-emerald-50/20 rounded-3xl"></div>
          <div className="text-center relative z-10">
            {/* Enhanced Logo/Icon with animation */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-110 animate-pulse">
              <span className="text-3xl animate-bounce">🚀</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 animate-fade-in">
              Join ChatBuddy
            </h2>
            <p className="text-gray-600 text-base font-medium mb-6 animate-fade-in delay-200">
              Start your AI-powered learning journey today
            </p>
            <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-full px-6 py-2 border border-green-200/50 animate-fade-in delay-300">
              <span className="text-gray-600 text-sm">Already have an account?</span>
              <Link
                to="/login"
                className="ml-2 font-bold text-green-600 hover:text-emerald-600 transition-colors duration-300 hover:underline flex items-center"
              >
                Sign In
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
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 bg-white/70 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-900 text-base hover:border-green-300 hover:bg-white/80"
                  placeholder="Your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 bg-white/70 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-900 text-base hover:border-green-300 hover:bg-white/80"
                  placeholder="Your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email field */}
              <div>
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
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 bg-white/70 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-900 text-base hover:border-green-300 hover:bg-white/80"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 bg-white/70 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-900 text-base hover:border-green-300 hover:bg-white/80"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 bg-white/70 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-900 text-base hover:border-green-300 hover:bg-white/80"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms agreement */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-0.5 text-green-600 focus:ring-green-500 border-green-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-3 block text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                    onClick={() => alert('Terms and Conditions coming soon!')}
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                    onClick={() => alert('Privacy Policy coming soon!')}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-5 px-8 border border-transparent text-base font-bold rounded-2xl text-white bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {isLoading ? (
                <div className="flex items-center relative z-10">
                  <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg">Creating your account...</span>
                </div>
              ) : (
                <div className="flex items-center relative z-10">
                  <span className="text-lg mr-3">Start Your Journey</span>
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
                <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
                onClick={() => alert('Google signup coming soon!')}
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
                onClick={() => alert('Facebook signup coming soon!')}
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

export default Signup;