const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken, inMemoryUsers } = require('./auth');
const User = require('../models/User');

const router = express.Router();

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get user stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected()) {
      // Use MongoDB
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Convert Map to regular object for JSON response
      const dailyActivity = {};
      if (user.stats.dailyActivity) {
        for (const [key, value] of user.stats.dailyActivity) {
          dailyActivity[key] = value;
        }
      }

      res.json({
        stats: {
          studySessions: user.stats.studySessions || 0,
          aiInteractions: user.stats.aiInteractions || 0,
          topicsLearned: user.stats.topicsLearned || [],
          dailyActivity,
          lastActivityDate: user.stats.lastActivityDate,
          recentActivities: user.stats.recentActivities || []
        }
      });
    } else {
      // Use in-memory storage for development
      console.log('Using in-memory user stats (MongoDB not connected)');

      // Find user by email from JWT token
      const userEmail = req.user.email;
      const user = inMemoryUsers[userEmail];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Initialize stats if they don't exist
      if (!user.stats) {
        user.stats = {
          studySessions: 0,
          aiInteractions: 0,
          topicsLearned: [],
          dailyActivity: {},
          lastActivityDate: null,
          recentActivities: []
        };
      }

      res.json({
        stats: {
          studySessions: user.stats.studySessions || 0,
          aiInteractions: user.stats.aiInteractions || 0,
          topicsLearned: user.stats.topicsLearned || [],
          dailyActivity: user.stats.dailyActivity || {},
          lastActivityDate: user.stats.lastActivityDate,
          recentActivities: user.stats.recentActivities || []
        }
      });
    }
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
});

// Update user stats
router.put('/stats', authenticateToken, async (req, res) => {
  try {
    const { studySessions, aiInteractions, topicsLearned } = req.body;

    if (isMongoConnected()) {
      // Use MongoDB
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update only provided fields
      if (studySessions !== undefined) user.stats.studySessions = studySessions;
      if (aiInteractions !== undefined) user.stats.aiInteractions = aiInteractions;
      if (topicsLearned !== undefined) user.stats.topicsLearned = topicsLearned;

      await user.save();

      res.json({
        message: 'Stats updated successfully',
        stats: user.stats
      });
    } else {
      // Use in-memory storage for development
      console.log('Using in-memory user stats update (MongoDB not connected)');

      const userEmail = req.user.email;
      const user = inMemoryUsers[userEmail];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Initialize stats if they don't exist
      if (!user.stats) {
        user.stats = {
          studySessions: 0,
          aiInteractions: 0,
          topicsLearned: [],
          dailyActivity: {},
          lastActivityDate: null,
          recentActivities: []
        };
      }

      // Update only provided fields
      if (studySessions !== undefined) user.stats.studySessions = studySessions;
      if (aiInteractions !== undefined) user.stats.aiInteractions = aiInteractions;
      if (topicsLearned !== undefined) user.stats.topicsLearned = topicsLearned;

      res.json({
        message: 'Stats updated successfully',
        stats: user.stats
      });
    }
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Failed to update user stats' });
  }
});

// Add topic to learned topics
router.post('/topics-learned', authenticateToken, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (isMongoConnected()) {
      // Use MongoDB
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Initialize topicsLearned array if it doesn't exist
      if (!user.stats.topicsLearned) {
        user.stats.topicsLearned = [];
      }

      // Add topic if not already present
      if (!user.stats.topicsLearned.includes(topic)) {
        user.stats.topicsLearned.push(topic);
        await user.save();
      }

      res.json({
        message: 'Topic added to learned topics',
        topicsLearned: user.stats.topicsLearned
      });
    } else {
      // Use in-memory storage for development
      console.log('Using in-memory topic tracking (MongoDB not connected)');

      const userEmail = req.user.email;
      const user = inMemoryUsers[userEmail];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Initialize stats and topicsLearned if they don't exist
      if (!user.stats) {
        user.stats = {
          studySessions: 0,
          aiInteractions: 0,
          topicsLearned: [],
          dailyActivity: {},
          lastActivityDate: null,
          recentActivities: []
        };
      }

      if (!user.stats.topicsLearned) {
        user.stats.topicsLearned = [];
      }

      // Add topic if not already present
      if (!user.stats.topicsLearned.includes(topic)) {
        user.stats.topicsLearned.push(topic);
      }

      res.json({
        message: 'Topic added to learned topics',
        topicsLearned: user.stats.topicsLearned
      });
    }
  } catch (error) {
    console.error('Add topic error:', error);
    res.status(500).json({ error: 'Failed to add topic' });
  }
});

// Get user profile (more detailed than auth/profile)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, name } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update provided fields
    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (name !== undefined) user.name = name.trim();

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;