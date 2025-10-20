# 🚀 Руководство по развертыванию

Подробная инструкция по развертыванию Telegram Mini App для датчиков TH-BLE.

## 📋 Подготовка

### 1. Проверка окружения

```bash
# Проверка версии Node.js
node --version  # Должно быть >= 18.0.0

# Проверка npm
npm --version
```

### 2. Установка зависимостей

```bash
cd TH_mini_app
npm install
```

## 🔨 Сборка проекта

### Режим разработки

```bash
# Запуск dev-сервера с hot-reload
npm run dev

# Приложение будет доступно на https://localhost:3000
```

### Продакшн сборка

```bash
# Сборка оптимизированной версии
npm run build

# Проверка собранной версии локально
npm run preview
```

## 🌐 Развертывание

### Вариант 1: Vercel (Рекомендуется)

#### Через CLI:

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин
vercel login

# Деплой
vercel

# Продакшн деплой
vercel --prod
```

#### Через веб-интерфейс:

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Нажмите **"New Project"**
3. Импортируйте ваш GitHub репозиторий
4. Настройки проекта:
   - **Framework Preset**: Vite
   - **Root Directory**: TH_mini_app
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Нажмите **"Deploy"**

✅ **Плюсы**: Автоматический HTTPS, CDN, GitHub интеграция  
⏱️ **Время деплоя**: 1-2 минуты

---

### Вариант 2: Netlify

#### Через drag-and-drop:

```bash
# Сборка проекта
npm run build

# Перетащите папку dist/ на app.netlify.com
```

#### Через CLI:

```bash
# Установка Netlify CLI
npm i -g netlify-cli

# Логин
netlify login

# Деплой
netlify deploy --prod --dir=dist
```

#### Через Git:

1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. **"New site from Git"**
3. Подключите репозиторий
4. Настройки:
   - **Base directory**: TH_mini_app
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Deploy

✅ **Плюсы**: Простой UI, бесплатные формы  
⏱️ **Время деплоя**: 1-3 минуты

---

### Вариант 3: GitHub Pages

```bash
# Установка gh-pages
npm install -D gh-pages

# Добавьте в package.json scripts:
{
  "deploy": "vite build && gh-pages -d dist"
}

# Деплой
npm run deploy
```

Настройте в `vite.config.ts`:

```ts
export default defineConfig({
  base: '/your-repo-name/', // Имя репозитория
  // ... остальные настройки
});
```

✅ **Плюсы**: Бесплатно, GitHub интеграция  
❌ **Минусы**: Только статика, нет server-side

---

### Вариант 4: Свой VPS/сервер

#### Nginx конфигурация:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/th-ble-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статики
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Деплой через SSH:

```bash
# Сборка локально
npm run build

# Копирование на сервер
scp -r dist/* user@server:/var/www/th-ble-app/

# Или через rsync
rsync -avz dist/ user@server:/var/www/th-ble-app/
```

✅ **Плюсы**: Полный контроль  
❌ **Минусы**: Требует администрирования

---

## 🤖 Настройка Telegram Bot

### 1. Создание бота

```
1. Откройте @BotFather
2. /newbot
3. Введите имя: "TH-BLE Monitor"
4. Введите username: "th_ble_monitor_bot"
5. Сохраните токен
```

### 2. Настройка Mini App

```
1. @BotFather → /mybots
2. Выберите бота
3. Bot Settings → Menu Button → Configure Menu Button
4. URL: https://your-deployed-app.vercel.app
5. Text: "🌡️ Открыть монитор"
```

### 3. Настройка описания

```
/setdescription
Выберите бота

Мониторинг датчиков температуры и влажности Escort TH-BLE через Bluetooth.

Возможности:
🌡️ Температура в реальном времени
💧 Влажность
🔋 Уровень батареи
📊 Графики данных
```

### 4. Настройка команд

```
/setcommands

start - Запустить приложение
help - Помощь
about - О приложении
```

### 5. Настройка фото

```
/setuserpic
Загрузите изображение 512x512px
```

## 🔒 Безопасность

### HTTPS обязателен!

Web Bluetooth API работает **только через HTTPS**. Все современные хостинги (Vercel, Netlify) предоставляют HTTPS автоматически.

### CSP заголовки

Добавьте в `public/_headers` (для Netlify):

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://telegram.org; connect-src 'self' https://api.telegram.org
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
```

## 📊 Мониторинг

### Vercel Analytics

```bash
npm install @vercel/analytics

# В main.tsx:
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Google Analytics

```html
<!-- В index.html -->
<script async src="https://www.googletagman.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

## 🔄 CI/CD

### GitHub Actions

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: cd TH_mini_app && npm ci
        
      - name: Build
        run: cd TH_mini_app && npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## ✅ Чеклист перед запуском

- [ ] Проект собирается без ошибок (`npm run build`)
- [ ] HTTPS настроен
- [ ] Telegram Bot создан
- [ ] Mini App URL настроен в BotFather
- [ ] Приложение открывается в Telegram
- [ ] Web Bluetooth работает (тестируйте на Chrome Android)
- [ ] Датчик подключается успешно
- [ ] Данные отображаются корректно

## 🐛 Траблшутинг

### Приложение не открывается в Telegram

1. Проверьте URL в настройках бота
2. Убедитесь, что сайт доступен по HTTPS
3. Очистите кэш Telegram

### Web Bluetooth не работает

1. Используйте **Chrome на Android**
2. Убедитесь в наличии HTTPS
3. Проверьте разрешения браузера

### Билд падает с ошибкой

```bash
# Очистка и переустановка
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи в консоли браузера
2. Посмотрите Issues на GitHub
3. Напишите в поддержку: t.me/EscortBLE_bot

---

**Готово! 🎉 Ваше приложение развернуто и готово к работе!**

