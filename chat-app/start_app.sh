#!/bin/bash

# MusicNBrain Chat App Startup Script
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
    echo ""
    echo "Stopping processes..."
    [ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID
    [ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID
    exit
}
trap cleanup SIGINT

# Check ports
check_port() {
    PORT=$1
    if command -v fuser &> /dev/null; then
        fuser -k -n tcp $PORT > /dev/null 2>&1
    elif command -v lsof &> /dev/null; then
        PID=$(lsof -ti :$PORT)
        [ ! -z "$PID" ] && kill -9 $PID
    fi
    sleep 1
}

echo "Checking ports..."
check_port 8000
check_port 5173

# Check .env
if [ ! -f "$PROJECT_ROOT/backend/.env" ]; then
    echo "WARNING: backend/.env not found. Copy .env.example and add your GOOGLE_API_KEY."
fi

# Start backend
echo "Starting backend..."
cd "$PROJECT_ROOT/backend"
uv sync
uv run python main.py &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd "$PROJECT_ROOT/frontend"
npm install
npm run dev -- --host &
FRONTEND_PID=$!

echo ""
echo "MusicNBrain is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop."
wait
