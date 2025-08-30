@echo off
title SevenIQ Local Development Server
color 0A

echo.
echo ========================================
echo    SevenIQ Local Development Server
echo ========================================
echo.
echo Starting local server at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

echo Starting development server...
npm run dev

pause
