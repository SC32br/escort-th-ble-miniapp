@echo off
title TH-BLE Monitor - Fix Deploy
echo.
echo ========================================
echo    TH-BLE Monitor - Fix Deploy
echo ========================================
echo.

cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo Checking Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git not found!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)
echo Git found - OK
echo.

echo Adding changes to Git...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Git add failed
    pause
    exit /b 1
)
echo Changes added - OK
echo.

echo Creating commit...
git commit -m "Fix: Resolve Vite build path issues"
if %errorlevel% neq 0 (
    echo ERROR: Git commit failed
    pause
    exit /b 1
)
echo Commit created - OK
echo.

echo Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Push failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Fix Deployed!
echo ========================================
echo.
echo Changes pushed to GitHub
echo Vercel will automatically rebuild
echo Check: https://github.com/SC32br/escort-th-ble-miniapp
echo.

pause