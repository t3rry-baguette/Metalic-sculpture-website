@echo off
REM Jua Kali Sculptures Backend - Setup Script (Windows)

echo.
echo ============================================
echo  Jua Kali Sculptures Backend Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the backend directory:
    echo cd backend
    echo setup.bat
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ============================================
echo     Ready to Start the Server!
echo ============================================
echo.
echo To start the server, run:
echo   npm start     (production mode)
echo   npm run dev   (development with auto-reload)
echo.
echo Once started, access:
echo   Admin Dashboard: http://localhost:3000/
echo   Order Form:      http://localhost:3000/order-form.html
echo   API Docs:        http://localhost:3000/api/health
echo.
pause
