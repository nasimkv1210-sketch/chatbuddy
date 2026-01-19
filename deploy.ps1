# ChatBuddy Deployment Script for Windows
# This script helps deploy the ChatBuddy application

param(
    [switch]$UseDocker,
    [switch]$SkipBuild
)

Write-Host "🚀 ChatBuddy Deployment Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if .env files exist
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found. Please copy env.example to .env and configure your environment variables." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "backend/.env")) {
    Write-Host "❌ backend/.env file not found. Please copy backend/env-template.txt to backend/.env and configure your environment variables." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment files found" -ForegroundColor Green

# Check if Docker is available
if ($UseDocker -or (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "🐳 Using Docker deployment..." -ForegroundColor Blue

    # Build and start services
    docker-compose down
    if (-not $SkipBuild) {
        docker-compose build --no-cache
    }
    docker-compose up -d

    Write-Host "✅ Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Frontend: http://localhost" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Check logs: docker-compose logs -f" -ForegroundColor Yellow
    Write-Host "🛑 Stop services: docker-compose down" -ForegroundColor Yellow

} else {
    Write-Host "🐳 Docker not found. Using manual deployment..." -ForegroundColor Blue

    # Install dependencies
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
    npm install

    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
    Set-Location backend
    npm install
    Set-Location ..

    # Build frontend
    if (-not $SkipBuild) {
        Write-Host "🔨 Building frontend..." -ForegroundColor Blue
        npm run build
    }

    # Start backend
    Write-Host "🚀 Starting backend server..." -ForegroundColor Blue
    $backendJob = Start-Job -ScriptBlock {
        Set-Location backend
        npm start
    }

    # Start frontend (serve built files)
    Write-Host "🚀 Starting frontend server..." -ForegroundColor Blue
    $frontendJob = Start-Job -ScriptBlock {
        npx serve -s dist -l 3000
    }

    Write-Host "✅ Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🛑 To stop: Stop-Job -Id $($backendJob.Id), $($frontendJob.Id)" -ForegroundColor Yellow

    # Wait for user input to keep jobs running
    Read-Host "Press Enter to stop services"

    # Stop jobs
    Stop-Job -Id $backendJob.Id, $frontendJob.Id
    Remove-Job -Id $backendJob.Id, $frontendJob.Id
}