@echo off
title Select Customers - Digital Agency Platform
echo ========================================
echo    Select Customers - Startup
echo ========================================
echo.
echo Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" cmd /c "npm run db:generate && npm run dev"
echo.
echo Starting Frontend (Next.js) Server...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /c "npm run dev"
echo.
echo ========================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo  Admin:    http://localhost:3000/dashboard
echo  Login:    admin / admin123
echo ========================================
echo.
pause
