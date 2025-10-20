@echo off
chcp 65001 >nul
title TH-BLE Monitor
echo.
echo ========================================
echo    TH-BLE Monitor - Запуск проекта
echo ========================================
echo.

REM Переходим в папку скрипта
cd /d "%~dp0"

REM Проверяем Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден! Установите с https://nodejs.org/
    pause
    exit /b 1
)

REM Проверяем package.json
if not exist "package.json" (
    echo ❌ Файл package.json не найден!
    pause
    exit /b 1
)

echo ✅ Node.js найден
echo ✅ package.json найден
echo.

REM Устанавливаем зависимости если нужно
if not exist "node_modules" (
    echo 📦 Устанавливаем зависимости...
    npm install
    if errorlevel 1 (
        echo ❌ Ошибка установки зависимостей
        pause
        exit /b 1
    )
    echo ✅ Зависимости установлены
) else (
    echo ✅ Зависимости уже установлены
)

echo.
echo 🚀 Запускаем dev сервер...
echo 🌐 Откройте браузер: http://localhost:3000
echo ⏹️  Для остановки нажмите Ctrl+C
echo.

npm run dev

pause