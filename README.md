# Escort TH-BLE: Telegram Mini App и Web Bluetooth

Telegram Mini App для мониторинга датчиков температуры и влажности Escort TH-BLE.

## Быстрый старт

### 1. Запуск проекта
Дважды кликните: **START.bat**

### 2. Настройка GitHub (опционально)
Дважды кликните: **GITHUB.bat**

## Требования

- Node.js (https://nodejs.org/)
- Git (https://git-scm.com/) - для GitHub

## Использование

1. Запустите **START.bat**
2. Откройте браузер: http://localhost:3000
3. Для Bluetooth тестирования используйте Chrome на Android

## GitHub Deploy

После запуска **GITHUB.bat**:

1. Перейдите: https://github.com/SC32br/escort-th-ble-miniapp
2. Settings → Pages → Source: "GitHub Actions"
3. Дождитесь завершения деплоя

## Структура проекта

```
TH_mini_app/
├── src/                 # Исходный код
├── public/              # Статические файлы
├── package.json         # Зависимости
├── START.bat           # Запуск проекта
├── GITHUB.bat          # Настройка GitHub
└── README.md           # Этот файл
```

## Возможности

- 🌡️ Мониторинг температуры и влажности
- 📊 Графики данных в реальном времени
- 🔵 Web Bluetooth API
- 📱 Telegram Mini App интеграция
- 🎨 Современный UI

## Технологии

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand
- Telegram WebApp SDK