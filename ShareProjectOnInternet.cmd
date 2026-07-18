@echo off
title Share Next.js Project on Internet (LocalTunnel)
color 0A
echo ===================================================
echo     Sharing your local server to the internet
echo ===================================================
echo.
echo Please make sure your project is running on port 3000 (npm run dev)
echo.
echo Starting LocalTunnel...
echo Please wait for the URL to appear below.
echo.
npx localtunnel --port 3000
pause
