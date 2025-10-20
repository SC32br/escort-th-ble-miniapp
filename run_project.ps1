# TH-BLE Monitor - PowerShell скрипт запуска
param(
    [switch]$SkipInstall
)

# Устанавливаем кодировку UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    TH-BLE Monitor - Запуск проекта" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Переходим в папку скрипта
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📁 Рабочая папка: $scriptPath" -ForegroundColor Green
Write-Host ""

# Проверяем наличие package.json
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ОШИБКА: Файл package.json не найден!" -ForegroundColor Red
    Write-Host "Убедитесь, что вы находитесь в папке проекта." -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host "✅ Найден package.json" -ForegroundColor Green
Write-Host ""

# Проверяем и устанавливаем зависимости
if (-not $SkipInstall) {
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Устанавливаем зависимости..." -ForegroundColor Yellow
        try {
            npm install
            if ($LASTEXITCODE -ne 0) {
                throw "Ошибка npm install"
            }
            Write-Host "✅ Зависимости установлены" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Ошибка при установке зависимостей: $_" -ForegroundColor Red
            Read-Host "Нажмите Enter для выхода"
            exit 1
        }
    } else {
        Write-Host "✅ Зависимости уже установлены" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🚀 Запускаем dev сервер..." -ForegroundColor Cyan
Write-Host "🌐 Откройте браузер: http://localhost:3000" -ForegroundColor Yellow
Write-Host "⏹️  Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

try {
    npm run dev
}
catch {
    Write-Host "❌ Ошибка при запуске сервера: $_" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
}