const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// In-memory user storage for development when MongoDB is not available
let inMemoryUsers = {};
let nextUserId = 1;

// Hash password utility (same as frontend)
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '7d' }
  );
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase();

    if (isMongoConnected()) {
      // Use MongoDB
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      // Hash password using the same method as frontend
      const passwordHash = await hashPassword(password);

      // Create new user
      const user = new User({
        email: normalizedEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        passwordHash: passwordHash
      });

      await user.save();

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } else {
      // Use in-memory storage for development
      console.log('Using in-memory user storage for registration (MongoDB not connected)');

      if (inMemoryUsers[normalizedEmail]) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      // Create in-memory user
      const user = {
        id: nextUserId++,
        email: normalizedEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        password: password, // Store plain password for in-memory (not secure for production!)
        createdAt: new Date().toISOString()
      };

      inMemoryUsers[normalizedEmail] = user;

      // Generate token
      const token = generateToken({
        _id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName
      });

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // ✅ IF MongoDB is NOT connected → use in-memory users
    if (!mongoose.connection.readyState) {
      const user = inMemoryUsers[email];

      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.json({
        message: 'Login successful (in-memory)',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    }

    // ✅ IF MongoDB IS connected → normal DB login
    const dbUser = await User.findOne({ email });
    if (!dbUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: dbUser._id,
        email: dbUser.email,
        name: dbUser.name
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected()) {
      // Use MongoDB
      const user = await User.findById(req.user.userId).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } else {
      // Use in-memory storage for development
      console.log('Using in-memory user profile (MongoDB not connected)');

      const userEmail = req.user.email;
      const user = inMemoryUsers[userEmail];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Logout route (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, (req, res) => {
  // In a real implementation, you might want to blacklist the token
  // For now, we'll just return success and let the client remove the token
  res.json({ message: 'Logout successful' });
});

module.exports = { router, authenticateToken, inMemoryUsers };