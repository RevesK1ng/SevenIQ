# SevenIQ Development Server Startup Script
# Run this script to start your local development server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SevenIQ Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if npm packages are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing npm packages..." -ForegroundColor Yellow
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Packages installed successfully" -ForegroundColor Green
        } else {
            throw "npm install failed"
        }
    } catch {
        Write-Host "❌ ERROR: Failed to install packages" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host ""
}

# Check if .env.local exists, if not create a basic one
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  WARNING: .env.local not found" -ForegroundColor Yellow
    Write-Host "Creating basic .env.local file from template..." -ForegroundColor Yellow
    try {
        Copy-Item "env.example" ".env.local" -ErrorAction Stop
        Write-Host "✅ Created .env.local from template" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env.local to configure your environment variables" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Failed to create .env.local" -ForegroundColor Red
        Write-Host "Please manually copy env.example to .env.local" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor White
Write-Host "1. Start your Next.js development server" -ForegroundColor White
Write-Host "2. Open your browser to the site" -ForegroundColor White
Write-Host "3. Keep the server running until you close this window" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to start..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "🌐 Starting server and opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

# Start the development server
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Green
try {
    npm run dev
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to start development server" -ForegroundColor Red
    Write-Host "This might be due to:" -ForegroundColor Yellow
    Write-Host "- Missing environment variables in .env.local" -ForegroundColor Yellow
    Write-Host "- Port 3000 already in use" -ForegroundColor Yellow
    Write-Host "- Missing dependencies" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Try running 'npm run dev' manually to see detailed error messages" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Server stopped. Press Enter to exit..." -ForegroundColor Yellow
Read-Host
