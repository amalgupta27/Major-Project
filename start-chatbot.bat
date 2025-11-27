@echo off
echo Starting Cultural Heritage AI Chatbot...
echo.

echo [1/3] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)

echo.
echo [2/3] Installing frontend dependencies...
cd ..\cultural-wonders
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)

echo.
echo [2.5/3] Ensuring backend .env exists...
cd ..
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo Created backend\.env from backend\.env.example. Please edit it with your API keys.
    ) else (
        echo WARNING: backend\.env and backend\.env.example not found. Please create backend\.env with required keys.
    )
) else (
    echo backend\.env already present.
)

echo.
echo [3/3] Starting servers...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:5173
echo.
echo IMPORTANT: Make sure to configure your API keys in backend/.env file!
echo See AI_CHATBOT_SETUP.md for detailed instructions.
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd cultural-wonders && npm run dev"

echo.
echo Both servers are starting...
echo Once both are ready, visit: http://localhost:5173/chat
echo.
pause
