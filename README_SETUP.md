# Пошаговая настройка Mini App с BLE-шлюзом

## 1. Подготовка окружения

### Фронтенд
```bash
cd TH_mini_app
npm install
cp docs/ENV.md .env
# Отредактируйте .env: VITE_API_URL=http://localhost:8080
```

### Бэкенд
```bash
cd TH_mini_app/backend
npm install
cp env.example .env
# Отредактируйте .env: укажите BOT_TOKEN от @BotFather
```

## 2. Запуск через Docker (рекомендуется)

```bash
# Создайте .env файл в корне проекта
echo "BOT_TOKEN=YOUR_BOT_TOKEN_HERE" > .env
echo "JWT_SECRET=your_secret_key" >> .env

# Запустите весь стек
docker-compose up -d

# Проверьте логи
docker-compose logs -f
```

## 3. Ручной запуск (для разработки)

### MQTT Broker
```bash
docker run -d --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  -v $(pwd)/mosquitto/config:/mosquitto/config \
  eclipse-mosquitto:2
```

### Backend API
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
npm run dev
```

## 4. Настройка Telegram Bot

1. Создайте бота через @BotFather
2. Получите токен бота
3. Укажите токен в `backend/.env` как `BOT_TOKEN`
4. Настройте Web App URL в боте:
   ```
   /setmenubutton
   /newapp
   https://your-domain.com
   ```

## 5. Тестирование

1. Откройте Mini App в Telegram
2. Проверьте авторизацию (должен появиться JWT)
3. Подключите BLE-устройство к MQTT
4. Проверьте получение данных в реальном времени

## 6. MQTT Топики

```
tele/{userId}/{deviceId}/state    # SensorData
tele/{userId}/{deviceId}/info     # SensorInfo
cmd/{userId}/{deviceId}           # Команды устройства
```

## 7. Troubleshooting

- **401 Unauthorized**: проверьте BOT_TOKEN
- **WebSocket не подключается**: проверьте порт 8081
- **MQTT не работает**: проверьте подключение к порту 1883
- **BLE не видит устройства**: проверьте права доступа к Bluetooth
