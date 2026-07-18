@echo off
title Share Project (Pinggy)
color 0B
echo ===================================================
echo     Sharing your local server via Pinggy (Port 443)
echo ===================================================
echo.
echo Please make sure your project is running on port 3000 (npm run dev)
echo.
echo Starting Pinggy over SSH...
echo.
ssh -p 443 -R0:localhost:3000 a.pinggy.io
pause
