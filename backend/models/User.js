const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  stats: {
    studySessions: { type: Number, default: 0 },
    aiInteractions: { type: Number, default: 0 },
    topicsLearned: [{ type: String }],
    dailyActivity: { type: Map, of: Number, default: {} },
    lastActivityDate: { type: String, default: null },
    recentActivities: [{
      id: { type: Number, required: true },
      type: { type: String, required: true },
      title: { type: String, required: true },
      time: { type: Date, required: true },
      icon: { type: String, required: true },
      color: { type: String, required: true }
    }]
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Update stats method
userSchema.methods.updateStats = function(updates) {
  if (!this.stats) {
    this.stats = {
      studySessions: 0,
      aiInteractions: 0,
      topicsLearned: [],
      dailyActivity: {},
      lastActivityDate: null,
      recentActivities: []
    };
  }

  Object.assign(this.stats, updates);
  return this.save();
};

// Record AI interaction method
userSchema.methods.recordAIInteraction = function(type, topic) {
  const now = new Date();
  const today = now.toDateString();

  // Create activity entry
  const activityEntry = {
    id: Date.now(),
    type: type,
    title: this.getActivityTitle(type, topic),
    time: now,
    icon: this.getActivityIcon(type),
    color: this.getActivityColor(type)
  };

  // Update stats
  if (!this.stats.dailyActivity) this.stats.dailyActivity = {};
  if (!this.stats.recentActivities) this.stats.recentActivities = [];

  this.stats.aiInteractions = (this.stats.aiInteractions || 0) + 1;
  this.stats.dailyActivity.set(today, (this.stats.dailyActivity.get(today) || 0) + 1);
  this.stats.lastActivityDate = today;
  this.stats.recentActivities.unshift(activityEntry);
  this.stats.recentActivities = this.stats.recentActivities.slice(0, 10); // Keep only last 10

  return this.save();
};

// Helper methods for activity formatting
userSchema.methods.getActivityTitle = function(type, topic) {
  const titles = {
    'explain': `Explained topic: ${topic}`,
    'quiz': `Generated quiz for: ${topic}`,
    'flashcards': `Created flashcards for: ${topic}`,
    'summarize': 'Summarized study notes',
    'question': 'Answered study question'
  };
  return titles[type] || `AI interaction: ${type}`;
};

userSchema.methods.getActivityIcon = function(type) {
  const icons = {
    'explain': '📚',
    'quiz': '🧠',
    'flashcards': '🎴',
    'summarize': '📝',
    'question': '❓'
  };
  return icons[type] || '🤖';
};

userSchema.methods.getActivityColor = function(type) {
  const colors = {
    'explain': 'bg-blue-500',
    'quiz': 'bg-purple-500',
    'flashcards': 'bg-green-500',
    'summarize': 'bg-yellow-500',
    'question': 'bg-red-500'
  };
  return colors[type] || 'bg-gray-500';
};

module.exports = mongoose.model('User', userSchema);