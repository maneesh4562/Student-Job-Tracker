#!/bin/bash

echo "🛑 Stopping AI Resume Analyzer Project..."

# Kill all related processes
echo "🔄 Stopping services..."
pkill -f "uvicorn" 2>/dev/null
pkill -f "node.*src/index.js" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Wait for processes to stop
sleep 3

echo "✅ All services stopped"
echo ""
echo "📋 You can view logs in the logs/ directory:"
echo "   - logs/nlp-service.log"
echo "   - logs/backend.log"
echo "   - logs/frontend.log" 