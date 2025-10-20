@echo off
echo ========================================
echo    TH-BLE Monitor - Запуск проекта
echo ========================================
echo.

REM Переходим в папку проекта
cd /d "%~dp0"

REM Проверяем наличие package.json
if not exist "package.json" (
    echo ОШИБКА: Файл package.json не найден!
    echo Убедитесь, что вы находитесь в папке проекта.
    pause
    exit /b 1
)

echo ✅ Найден package.json
echo.

REM Проверяем наличие node_modules
if not exist "node_modules" (
    echo 📦 Устанавливаем зависимости...
    npm install
    if errorlevel 1 (
        echo ❌ Ошибка при установке зависимостей
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