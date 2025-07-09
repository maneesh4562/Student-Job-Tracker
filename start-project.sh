#!/bin/bash

echo "🚀 Starting AI Resume Analyzer Project..."

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "uvicorn" 2>/dev/null
pkill -f "node.*src/index.js" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Wait a moment for processes to stop
sleep 2

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! brew services list | grep -q "mongodb-community.*started"; then
    echo "❌ MongoDB is not running. Starting it..."
    brew services start mongodb-community
    sleep 5
else
    echo "✅ MongoDB is running"
fi

# Start NLP Service
echo "🤖 Starting NLP Service (Port 8000)..."
cd nlp-service
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 > ../logs/nlp-service.log 2>&1 &
NLP_PID=$!
cd ..

# Start Backend Server
echo "🔧 Starting Backend Server (Port 5001)..."
cd server
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "🎨 Starting Frontend (Port 5173)..."
cd client
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Test services
echo "🧪 Testing services..."

# Test Backend
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:5001"
else
    echo "❌ Backend failed to start"
fi

# Test NLP Service
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ NLP Service is running on http://localhost:8000"
else
    echo "❌ NLP Service failed to start"
fi

# Test Frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:5173"
else
    echo "❌ Frontend failed to start"
fi

echo ""
echo "🎉 Project startup complete!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5001/api"
echo "   NLP Service: http://localhost:8000"
echo ""
echo "📋 Logs are available in the logs/ directory"
echo "🛑 To stop all services, run: ./stop-project.sh"
echo ""
echo "Process IDs:"
echo "   NLP Service: $NLP_PID"
echo "   Backend: $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID" 