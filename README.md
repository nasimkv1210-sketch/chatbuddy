# ChatBuddy - AI Study Assistant

A full-stack AI-powered study assistant with separate frontend and backend, ready for production deployment.

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd chatbuddy

# Copy environment files
cp env.example .env
cp backend/env-template.txt backend/.env

# Edit environment variables (see Environment Setup below)
# Then deploy with Docker
./deploy.sh
# or on Windows: .\deploy.ps1 -UseDocker
```

### Manual Setup
```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Configure environment variables (see below)

# Start development servers
npm run dev    # Frontend on :5173
cd backend && npm run dev  # Backend on :5000
```

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI**: OpenRouter API for AI-powered features
- **Deployment**: Docker + Docker Compose

## ✨ Features

- 🔐 User authentication and registration
- 🤖 AI-powered topic explanations
- 📝 Study note summarization
- 🧠 Quiz generation with interactive answers
- 🎴 Flashcard creation
- 📊 User statistics and activity tracking
- 🔥 Study streak tracking
- 🐳 Docker deployment ready
- 📱 Responsive design

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose (for containerized deployment)
- MongoDB (local or MongoDB Atlas)
- OpenRouter API key (from https://openrouter.ai/)

## 🔧 Environment Setup

### Frontend (.env)
```bash
# Copy from env.example
cp env.example .env

# Edit .env
VITE_API_BASE_URL=http://localhost:5000/api
# For production: VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Backend (backend/.env)
```bash
# Copy from template
cp backend/env-template.txt backend/.env

# Required variables
MONGODB_URI=mongodb://localhost:27017/chatbuddy
JWT_SECRET=your_secure_jwt_secret_here
OPENAI_API_KEY=sk-or-v1-your-openrouter-api-key
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development

# For MongoDB Atlas (production):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbuddy?retryWrites=true&w=majority

# Generate secure JWT secret:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚀 Deployment

### Option 1: Docker Deployment (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Manual Deployment

```bash
# Backend
cd backend
npm run build  # (if needed)
npm start      # Production mode

# Frontend
npm run build
npm run preview  # or serve with nginx/apache
```

### Option 3: Cloud Deployment

#### Backend (Railway, Render, Heroku, etc.)
```bash
# Set environment variables in your cloud provider
# Deploy the backend directory
```

#### Frontend (Vercel, Netlify, etc.)
```bash
# Build command: npm run build
# Output directory: dist
# Set VITE_API_BASE_URL to your backend URL
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### User Management
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/stats` - Update user statistics
- `POST /api/users/topics-learned` - Add learned topic

### AI Features
- `POST /api/ai/explain-topic` - Explain a topic
- `POST /api/ai/summarize-notes` - Summarize notes
- `POST /api/ai/generate-quiz` - Generate quiz
- `POST /api/ai/generate-flashcards` - Generate flashcards
- `POST /api/ai/ask-question` - Ask AI question
- `GET /api/ai/test-connection` - Test AI connection

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

#### Backend
```bash
npm run dev        # Development with nodemon
npm start          # Production mode
npm run pm2:start  # Start with PM2
npm run pm2:stop   # Stop PM2 process
```

### Project Structure
```
chatbuddy/
├── backend/           # Node.js/Express server
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── server.js      # Main server file
│   ├── Dockerfile     # Backend container
│   └── package.json   # Backend dependencies
├── src/              # React frontend
│   ├── components/   # React components
│   ├── services/     # API service layer
│   └── ...
├── public/           # Static assets
├── dist/            # Built frontend (generated)
├── docker-compose.yml # Docker orchestration
├── Dockerfile.frontend # Frontend container
├── nginx.conf       # Nginx configuration
├── deploy.sh        # Linux deployment script
├── deploy.ps1       # Windows deployment script
└── README.md        # This file
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing control
- **Rate Limiting**: API rate limiting
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Request sanitization
- **Environment Variables**: Sensitive data protection

## 🧪 Testing

### Manual Testing
1. Register a new account
2. Login with credentials
3. Test AI features:
   - Explain a topic
   - Summarize notes
   - Generate a quiz
   - Create flashcards

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Test AI connection
curl http://localhost:5000/api/ai/test-connection \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 Migration Notes

This version has been migrated from a localStorage-based frontend-only application to a proper full-stack application with:

- **Backend API**: Handles all business logic, AI calls, and data persistence
- **Database**: MongoDB for user data and statistics
- **Authentication**: JWT-based authentication
- **Security**: Proper input validation, rate limiting, and CORS
- **Deployment**: Docker containerization for easy deployment

All user data is now securely stored in the database instead of localStorage.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details.

## 🆘 Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure MongoDB is running (if using local)
4. Check OpenRouter API key is valid

For more help, please open an issue on GitHub.