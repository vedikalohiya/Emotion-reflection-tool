#!/bin/bash

echo "🚀 Setting up Emotion Reflection Tool..."

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

# Start Backend in background
echo "🐍 Starting Backend on port 8000..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Frontend Setup
echo "🎨 Setting up Frontend..."
cd ../frontend
npm install

# Start Frontend
echo "✨ Starting Frontend on port 3000..."
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
