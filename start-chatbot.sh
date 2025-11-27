#!/bin/bash

echo "Starting Cultural Heritage AI Chatbot..."
echo

echo "[1/3] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies!"
    exit 1
fi

echo
echo "[2/3] Installing frontend dependencies..."
cd ../cultural-wonders
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies!"
    exit 1
fi

echo
echo "[3/3] Starting servers..."
echo
echo "Backend will start on: http://localhost:5000"
echo "Frontend will start on: http://localhost:5173"
echo
echo "IMPORTANT: Make sure to configure your API keys in backend/.env file!"
echo "See AI_CHATBOT_SETUP.md for detailed instructions."
echo

# Start backend server in background
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server in background
cd ../cultural-wonders
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Once both are ready, visit: http://localhost:5173/chat"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
