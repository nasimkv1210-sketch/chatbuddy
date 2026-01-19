// Frontend API service to communicate with backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('chatbuddy_token');
  }

  // Set token
  setToken(token) {
    localStorage.setItem('chatbuddy_token', token);
  }

  // Remove token
  removeToken() {
    localStorage.removeItem('chatbuddy_token');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.token) {
      this.setToken(response.token);
      localStorage.setItem('chatbuddy_current_user', JSON.stringify(response.user));
      localStorage.setItem('chatbuddy_user_profile', JSON.stringify({
        name: response.user.name,
        email: response.user.email
      }));
      window.dispatchEvent(new Event('authChange'));
    }

    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.token) {
      this.setToken(response.token);
      localStorage.setItem('chatbuddy_current_user', JSON.stringify(response.user));
      localStorage.setItem('chatbuddy_user_profile', JSON.stringify({
        name: response.user.name,
        email: response.user.email
      }));
      window.dispatchEvent(new Event('authChange'));
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout API call failed, but proceeding with local logout:', error);
    }

    this.removeToken();
    localStorage.removeItem('chatbuddy_current_user');
    localStorage.removeItem('chatbuddy_user_profile');
    window.dispatchEvent(new Event('authChange'));
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  // User stats and data methods
  async getUserStats() {
    return await this.request('/users/stats');
  }

  async updateUserStats(stats) {
    return await this.request('/users/stats', {
      method: 'PUT',
      body: JSON.stringify(stats)
    });
  }

  async addLearnedTopic(topic) {
    return await this.request('/users/topics-learned', {
      method: 'POST',
      body: JSON.stringify({ topic })
    });
  }

  // AI service methods (now call backend instead of direct API)
  async explainTopic(topic) {
    return await this.request('/ai/explain-topic', {
      method: 'POST',
      body: JSON.stringify({ topic })
    });
  }

  async summarizeNotes(notes) {
    return await this.request('/ai/summarize-notes', {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  }

  async generateQuiz(topic) {
    return await this.request('/ai/generate-quiz', {
      method: 'POST',
      body: JSON.stringify({ topic })
    });
  }

  async generateFlashcards(topic) {
    return await this.request('/ai/generate-flashcards', {
      method: 'POST',
      body: JSON.stringify({ topic })
    });
  }

  async askQuestion(question) {
    return await this.request('/ai/ask-question', {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  }

  async testConnection() {
    return await this.request('/ai/test-connection');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT validation (check if not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Get current user from localStorage (for backward compatibility)
  getCurrentUser() {
    const userStr = localStorage.getItem('chatbuddy_current_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export individual functions for convenience
export const register = (userData) => apiService.register(userData);
export const login = (credentials) => apiService.login(credentials);
export const logout = () => apiService.logout();
export const getProfile = () => apiService.getProfile();
export const getUserStats = () => apiService.getUserStats();
export const updateUserStats = (stats) => apiService.updateUserStats(stats);
export const addLearnedTopic = (topic) => apiService.addLearnedTopic(topic);
export const explainTopic = (topic) => apiService.explainTopic(topic);
export const summarizeNotes = (notes) => apiService.summarizeNotes(notes);
export const generateQuiz = (topic) => apiService.generateQuiz(topic);
export const generateFlashcards = (topic) => apiService.generateFlashcards(topic);
export const askQuestion = (question) => apiService.askQuestion(question);
export const testConnection = () => apiService.testConnection();
export const isAuthenticated = () => apiService.isAuthenticated();
export const getCurrentUser = () => apiService.getCurrentUser();