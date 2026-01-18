import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Settings utilities
const getUserProfile = () => {
  const profile = JSON.parse(localStorage.getItem('chatbuddy_user_profile') || '{}');
  return {
    name: profile.name || 'John Doe',
    email: profile.email || 'user@chatbuddy.com'
  };
};

const updateUserProfile = (updates) => {
  const currentProfile = getUserProfile();
  const newProfile = { ...currentProfile, ...updates };
  localStorage.setItem('chatbuddy_user_profile', JSON.stringify(newProfile));
  return newProfile;
};

const getSettings = () => {
  return JSON.parse(localStorage.getItem('chatbuddy_settings') || '{}');
};

const updateSettings = (updates) => {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...updates };
  localStorage.setItem('chatbuddy_settings', JSON.stringify(newSettings));
  return newSettings;
};

const Settings = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({ name: '', email: '' });
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    autoSave: true,
    studyReminders: false,
    darkMode: false,
    language: 'en'
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');

  // Load data on component mount
  useEffect(() => {
    const profile = getUserProfile();
    const userSettings = getSettings();

    setUserProfile(profile);
    setSettings({
      notifications: userSettings.notifications ?? true,
      soundEffects: userSettings.soundEffects ?? true,
      autoSave: userSettings.autoSave ?? true,
      studyReminders: userSettings.studyReminders ?? false,
      darkMode: userSettings.darkMode ?? false,
      language: userSettings.language ?? 'en'
    });
  }, []);

  const handleProfileUpdate = () => {
    if (editName.trim()) {
      const updatedProfile = updateUserProfile({ name: editName.trim() });
      setUserProfile(updatedProfile);
      setIsEditingProfile(false);
    }
  };

  const handleSettingChange = (key, value) => {
    const updatedSettings = updateSettings({ [key]: value });
    setSettings(updatedSettings);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Clear all user data
      localStorage.removeItem('chatbuddy_current_user');
      localStorage.removeItem('chatbuddy_user_profile');
      localStorage.removeItem('chatbuddy_settings');
      localStorage.removeItem('chatbuddy_stats');
      localStorage.removeItem('chatbuddy_users');

      // Dispatch logout event
      window.dispatchEvent(new Event('authChange'));

      // Redirect to home
      navigate('/');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'study', label: 'Study', icon: '🎓' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'help', label: 'Help', icon: '❓' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Customize your ChatBuddy experience</p>
        </div>

        {/* Settings Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1">
            <div className="flex bg-white rounded-2xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

                {/* Profile Avatar & Name */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">
                        {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{userProfile.name}</h3>
                      <p className="text-gray-600">{userProfile.email}</p>
                      <button
                        onClick={() => {
                          setIsEditingProfile(true);
                          setEditName(userProfile.name);
                        }}
                        className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <span>✏️</span>
                        <span>Edit Name</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Edit Name Modal */}
                {isEditingProfile && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile Name</h4>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleProfileUpdate();
                          if (e.key === 'Escape') setIsEditingProfile(false);
                        }}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your name"
                        autoFocus
                      />
                      <button
                        onClick={handleProfileUpdate}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Account Info */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">{userProfile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">Free Account</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Study Tab */}
            {activeTab === 'study' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Preferences</h2>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Auto-save Progress</h4>
                        <p className="text-gray-600 text-sm">Automatically save your study progress</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoSave}
                          onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Study Reminders</h4>
                        <p className="text-gray-600 text-sm">Get notified about study streaks and goals</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.studyReminders}
                          onChange={(e) => handleSettingChange('studyReminders', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Preferred Study Time</h4>
                    <select
                      value={settings.studyTime || 'anytime'}
                      onChange={(e) => handleSettingChange('studyTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                      <option value="morning">Morning (6 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                      <option value="evening">Evening (6 PM - 12 AM)</option>
                      <option value="night">Night (12 AM - 6 AM)</option>
                      <option value="anytime">Anytime</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Push Notifications</h4>
                        <p className="text-gray-600 text-sm">Receive notifications about your study progress</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications}
                          onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Sound Effects</h4>
                        <p className="text-gray-600 text-sm">Play sounds for interactions and achievements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.soundEffects}
                          onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Email Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.emailWeekly || false}
                          onChange={(e) => handleSettingChange('emailWeekly', e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-gray-700">Weekly progress reports</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.emailAchievements || false}
                          onChange={(e) => handleSettingChange('emailAchievements', e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-gray-700">Achievement notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Security</h2>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Data Usage</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Your study data is stored locally on your device. We use AI services to process your requests,
                      but your personal information is never shared with third parties.
                    </p>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      Learn more about our privacy policy →
                    </button>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-red-900 mb-3">Danger Zone</h4>
                    <p className="text-red-700 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-300"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Help Tab */}
            {activeTab === 'help' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Learn how to use ChatBuddy's AI study tools effectively.
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Tutorial →
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">❓</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Find answers to commonly asked questions about ChatBuddy.
                    </p>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Browse FAQ →
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Need help? Our support team is here to assist you.
                    </p>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Get Support →
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">What's New</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Stay updated with the latest features and improvements.
                    </p>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      See Changelog →
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">App Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Version:</span>
                      <span className="ml-2 text-gray-600">1.0.0</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Updated:</span>
                      <span className="ml-2 text-gray-600">January 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;