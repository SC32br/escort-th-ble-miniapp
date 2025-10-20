# 🚀 Настройка GitHub репозитория

## 📋 Что нужно сделать:

### 1. **Загрузить код в GitHub**

```bash
# Инициализация git (если еще не сделано)
git init

# Добавление удаленного репозитория
git remote add origin https://github.com/SC32br/escort-th-ble-miniapp.git

# Добавление всех файлов
git add .

# Коммит
git commit -m "Initial commit: TH-BLE Monitor project"

# Загрузка в GitHub
git push -u origin main
```

### 2. **Настройка GitHub Pages**

1. Перейдите в **Settings** репозитория
2. Найдите раздел **Pages**
3. В **Source** выберите **GitHub Actions**
4. Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 3. **Настройка Vercel (альтернатива)**

1. Перейдите на [vercel.com](https://vercel.com)
2. Подключите GitHub аккаунт
3. Импортируйте репозиторий `escort-th-ble-miniapp`
4. Vercel автоматически определит настройки
5. Нажмите **Deploy**

### 4. **Настройка Telegram Bot**

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота
4. **Bot Settings** → **Mini Apps**
5. Отправьте URL: `https://your-username.github.io/escort-th-ble-miniapp`

## 🔧 Локальная разработка

### Запуск проекта:

1. **Простой способ**: Дважды кликните `start.bat`
2. **Через командную строку**:
   ```bash
   cd TH_mini_app
   npm install
   npm run dev
   ```

### Тестирование:

- Откройте http://localhost:3000
- Для Bluetooth тестирования используйте Chrome на Android
- Для Telegram тестирования используйте Telegram Desktop

## 📱 Деплой на Vercel

После настройки Vercel:

1. **Автоматический деплой** при каждом push в main
2. **HTTPS** включен по умолчанию
3. **Домен**: `your-project.vercel.app`
4. **Telegram URL**: `https://your-project.vercel.app`

## 🎯 Следующие шаги:

1. ✅ Загрузить код в GitHub
2. ✅ Настроить деплой (Vercel или GitHub Pages)
3. ✅ Настроить Telegram Bot
4. ✅ Протестировать в Telegram

## 🔗 Полезные ссылки:

- [GitHub репозиторий](https://github.com/SC32br/escort-th-ble-miniapp)
- [Vercel](https://vercel.com)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)