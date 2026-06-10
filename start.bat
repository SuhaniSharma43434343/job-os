@echo off
echo ===============================================
echo 🚀 Launching Job OS...
echo ===============================================
echo.
echo 1. Opening default browser to http://localhost:3000...
start "" "http://localhost:3000"
echo.
echo 2. Starting local web server...
"C:\Users\2303031050616\.gemini\antigravity\scratch\nodejs\node-v20.19.2-win-x64\node.exe" server.js
if %ERRORLEVEL% neq 0 (
  echo.
  echo ⚠️ Error starting server. Please make sure no other process is using port 3000.
)
pause
