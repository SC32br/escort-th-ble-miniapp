@echo off
title TH-BLE Monitor - GitHub Setup
echo.
echo ========================================
echo    TH-BLE Monitor - GitHub Setup
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

echo Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ERROR: Git init failed
    pause
    exit /b 1
)
echo Git repository initialized - OK
echo.

echo Adding remote repository...
git remote add origin https://github.com/SC32br/escort-th-ble-miniapp.git
echo Remote added - OK
echo.

echo Adding files to Git...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Git add failed
    pause
    exit /b 1
)
echo Files added - OK
echo.

echo Creating commit...
git commit -m "Initial commit: TH-BLE Monitor project"
if %errorlevel% neq 0 (
    echo ERROR: Git commit failed
    pause
    exit /b 1
)
echo Commit created - OK
echo.

echo Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo WARNING: Push failed
    echo You may need to authenticate with GitHub
    echo Or check repository permissions
)

echo.
echo ========================================
echo    GitHub Setup Complete!
echo ========================================
echo.
echo Repository: https://github.com/SC32br/escort-th-ble-miniapp
echo.
echo Next steps:
echo 1. Go to repository Settings
echo 2. Find Pages section
echo 3. Select "GitHub Actions" as source
echo 4. Wait for deployment to complete
echo.

pause