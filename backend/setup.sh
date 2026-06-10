#!/bin/bash

# Jua Kali Sculptures Backend - Setup Script
# This script installs dependencies and starts the server

echo "╔════════════════════════════════════════════╗"
echo "║ Jua Kali Sculptures Backend Setup          ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    echo "Please run this script from the backend directory:"
    echo "cd backend && bash setup.sh"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✓ Dependencies installed successfully!"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║         Ready to Start the Server!         ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "To start the server, run:"
echo "  npm start     (production mode)"
echo "  npm run dev   (development with auto-reload)"
echo ""
echo "Once started, access:"
echo "  Admin Dashboard: http://localhost:3000/"
echo "  Order Form:      http://localhost:3000/order-form.html"
echo "  API Docs:        http://localhost:3000/api/health"
echo ""
