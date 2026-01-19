@echo off
echo Starting ChatBuddy - Frontend and Backend
echo.

echo Starting backend server...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend server...
start cmd /k "npm run dev"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul