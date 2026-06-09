@echo off
title TruckFleet Pro Backend Server
color 0A
echo =======================================================
echo     Starting TruckFleet Pro Local Backend Server
echo =======================================================
echo.
cd backend
echo Installing dependencies (if any are missing)...
call npm install
echo.
echo Starting the server on port 3000...
echo Keep this window open while you are using the website!
echo.
start http://localhost:3000
node server.js
pause
