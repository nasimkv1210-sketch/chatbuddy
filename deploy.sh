#!/bin/bash

# ChatBuddy Deployment Script
# This script helps deploy the ChatBuddy application

set -e

echo "🚀 ChatBuddy Deployment Script"
echo "================================"

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy env.example to .env and configure your environment variables."
    exit 1
fi

if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found. Please copy backend/env-template.txt to backend/.env and configure your environment variables."
    exit 1
fi

echo "✅ Environment files found"

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker found. Using Docker deployment..."

    # Build and start services
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d

    echo "✅ Deployment completed!"
    echo ""
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:5000"
    echo ""
    echo "📊 Check logs: docker-compose logs -f"
    echo "🛑 Stop services: docker-compose down"

else
    echo "🐳 Docker not found. Using manual deployment..."

    # Install dependencies
    echo "📦 Installing frontend dependencies..."
    npm install

    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..

    # Build frontend
    echo "🔨 Building frontend..."
    npm run build

    # Start backend
    echo "🚀 Starting backend server..."
    cd backend && npm start &
    BACKEND_PID=$!

    # Start frontend (serve built files)
    echo "🚀 Starting frontend server..."
    npx serve -s dist -l 3000 &
    FRONTEND_PID=$!

    echo "✅ Deployment completed!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo ""
    echo "🛑 To stop: kill $BACKEND_PID $FRONTEND_PID"
fi