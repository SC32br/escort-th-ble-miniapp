# PowerShell скрипт для запуска dev сервера
$ErrorActionPreference = "Stop"

# Устанавливаем кодировку UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"

# Переходим в папку проекта
$projectPath = "C:\Users\Admin\Desktop\Эскорт_Протокол_BLE -2\TH_mini_app"
Set-Location $projectPath

Write-Host "Запуск dev сервера в папке: $projectPath" -ForegroundColor Green

# Запускаем npm run dev
try {
    npm run dev
} catch {
    Write-Host "Ошибка при запуске: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
}