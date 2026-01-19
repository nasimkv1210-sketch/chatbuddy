const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// Load environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Manual fallback for environment variables if dotenv fails
if (!process.env.OPENAI_API_KEY) {
  const fs = require('fs');
  try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const cleanKey = key.trim();
            const value = valueParts.join('=').trim();
            process.env[cleanKey] = value;
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to load environment variables:', error.message);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbuddy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Server will continue without database connection. Some features may not work.');
    console.log('Using in-memory storage for development.');

    // Create a default test user for development
    console.log('✅ Creating default test user...');
    const testEmail = 'test@example.com';
    const authRoutes = require('./routes/auth');
    if (!authRoutes.inMemoryUsers[testEmail]) {
      authRoutes.inMemoryUsers[testEmail] = {
        id: 1,
        email: testEmail,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        password: 'password123',
        createdAt: new Date().toISOString()
      };
      console.log('   Email: test@example.com');
      console.log('   Password: password123');
      console.log('   You can now login with these credentials!');
    }
  }
};

connectDB();

// Load routes after environment setup
console.log('🔄 Setting up routes...');
app.use('/api/auth', require('./routes/auth').router);
app.use('/api/users', require('./routes/users'));

// Environment variables should be loaded by now, load AI routes
console.log('🔄 Loading AI routes...');
const getAIRoutes = require('./routes/ai');
app.use('/api/ai', getAIRoutes());
console.log('✅ All routes loaded successfully');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});