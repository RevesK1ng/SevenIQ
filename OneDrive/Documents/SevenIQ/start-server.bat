@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    SevenIQ Development Server
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

REM Check if npm packages are installed
if not exist "node_modules" (
    echo 📦 Installing npm packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ ERROR: Failed to install packages
        pause
        exit /b 1
    )
    echo ✅ Packages installed successfully
    echo.
)

REM Check if .env.local exists, if not create a basic one
if not exist ".env.local" (
    echo ⚠️  WARNING: .env.local not found
    echo Creating basic .env.local file from template...
    copy "env.example" ".env.local" >nul 2>&1
    if exist ".env.local" (
        echo ✅ Created .env.local from template
        echo ⚠️  Please edit .env.local to configure your environment variables
        echo.
    ) else (
        echo ❌ Failed to create .env.local
        echo Please manually copy env.example to .env.local
        echo.
    )
)

echo 🚀 Starting development server...
echo.
echo This will:
echo 1. Start your Next.js development server
echo 2. Open your browser to the site
echo 3. Keep the server running until you close this window
echo.
echo Press any key to start...
pause >nul

echo.
echo 🌐 Starting server and opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:3000

REM Start the development server with proper error handling
echo 🚀 Starting Next.js development server...
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Failed to start development server
    echo This might be due to:
    echo - Missing environment variables in .env.local
    echo - Port 3000 already in use
    echo - Missing dependencies
    echo.
    echo Try running 'npm run dev' manually to see detailed error messages
    echo.
    pause
    exit /b 1
)

echo.
echo Server stopped. Press any key to exit...
pause >nul
