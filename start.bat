@echo off
title AI Study Plan Generator

echo ========================================
echo   AI Study Plan Generator - Launcher
echo ========================================
echo.
echo Starting Backend Server (port 5000)...
start "Backend" cmd /k "cd /d c:\AMMU\Project\server && npm run dev"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Dev Server (port 5173)...
start "Frontend" cmd /k "cd /d c:\AMMU\Project\client && npm run dev -- --host"

echo Waiting for frontend to initialize...
timeout /t 4 /nobreak > nul

echo.
echo Opening app in browser...
start http://localhost:5173

echo.
echo ========================================
echo   Both servers are running!
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Close the Backend and Frontend windows to stop the servers.
pause
