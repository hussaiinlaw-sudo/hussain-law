@echo off
setlocal

cd /d "%~dp0"

echo Starting Hussein Al Rashdi Law Firm website...
echo.

if not exist "node_modules" (
  echo Installing dependencies. This may take a few minutes...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Opening local development server at http://localhost:5173/
start "" "http://localhost:5173/"
call npm run dev -- --port 5173

pause
