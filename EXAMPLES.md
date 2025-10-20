# 📚 Примеры использования

Практические примеры работы с приложением и API.

## 🔵 Работа с BLE API

### Базовое подключение

```typescript
import { THBLEDevice } from '@/lib/ble-api';

const device = new THBLEDevice();

// Подключение
const sensorInfo = await device.connect();
console.log('Подключено:', sensorInfo);

// Получение данных
const data = await device.getAllData();
console.log('Температура:', data.temperature);
console.log('Влажность:', data.humidity);
console.log('Батарея:', data.battery);
```

### Обработка событий

```typescript
const device = new THBLEDevice();

// Обработчик данных
device.onData((data) => {
  console.log('Новые данные:', data);
  updateUI(data);
});

// Обработчик отключения
device.onDisconnect(() => {
  console.log('Датчик отключен');
  showNotification('Соединение потеряно');
});

// Обработчик ошибок
device.onError((error) => {
  console.error('Ошибка:', error);
  showError(error.message);
});

await device.connect();
```

### Отправка команд

```typescript
const device = new THBLEDevice();
await device.connect();

// Синхронизация времени
await device.synchronizeTime();

// Ввод пароля
const success = await device.enterPassword('123456');
if (success) {
  console.log('Пароль принят');
}

// Перезагрузка
await device.rebootDevice();
```

## 🎨 Работа с UI компонентами

### Использование SensorCard

```tsx
import { SensorCard } from '@/components/SensorCard';
import { useSensorStore } from '@/store/useSensorStore';

function MyApp() {
  const { latestData, connectionStatus } = useSensorStore();
  const isConnected = connectionStatus === 'connected';

  return (
    <SensorCard 
      data={latestData} 
      isConnected={isConnected} 
    />
  );
}
```

### Использование DataChart

```tsx
import { DataChart } from '@/components/DataChart';
import { useSensorStore } from '@/store/useSensorStore';

function ChartsPage() {
  const { dataHistory } = useSensorStore();

  return (
    <div>
      {/* Только температура */}
      <DataChart 
        data={dataHistory} 
        showTemperature={true}
        showHumidity={false}
      />

      {/* Только влажность */}
      <DataChart 
        data={dataHistory} 
        showTemperature={false}
        showHumidity={true}
      />

      {/* Оба параметра */}
      <DataChart 
        data={dataHistory} 
        showTemperature={true}
        showHumidity={true}
      />
    </div>
  );
}
```

## 📊 Работа с Store

### Базовое использование

```tsx
import { useSensorStore } from '@/store/useSensorStore';

function SensorPage() {
  const { 
    currentSensor,
    latestData,
    connectToSensor,
    disconnectSensor,
    refreshData 
  } = useSensorStore();

  return (
    <div>
      {currentSensor ? (
        <>
          <p>Датчик: {currentSensor.name}</p>
          <p>Температура: {latestData?.temperature}°C</p>
          <button onClick={refreshData}>Обновить</button>
          <button onClick={disconnectSensor}>Отключить</button>
        </>
      ) : (
        <button onClick={connectToSensor}>
          Подключиться
        </button>
      )}
    </div>
  );
}
```

### Подписка на изменения

```tsx
import { useEffect } from 'react';
import { useSensorStore } from '@/store/useSensorStore';

function TemperatureAlert() {
  const { latestData, addLog } = useSensorStore();

  useEffect(() => {
    if (latestData?.temperature && latestData.temperature > 35) {
      addLog(
        'Предупреждение', 
        'error', 
        `Высокая температура: ${latestData.temperature}°C`
      );
      telegram.hapticFeedback('error');
      telegram.showAlert('⚠️ Температура превысила 35°C!');
    }
  }, [latestData]);

  return null;
}
```

## 📱 Интеграция с Telegram

### Haptic Feedback

```typescript
import { telegram } from '@/lib/telegram';

// Легкая вибрация
telegram.hapticFeedback('light');

// Средняя вибрация
telegram.hapticFeedback('medium');

// Тяжелая вибрация
telegram.hapticFeedback('heavy');

// Уведомления
telegram.hapticFeedback('success'); // ✅
telegram.hapticFeedback('error');   // ❌
telegram.hapticFeedback('warning'); // ⚠️
```

### Алерты и диалоги

```typescript
import { telegram } from '@/lib/telegram';

// Простой алерт
telegram.showAlert('Данные сохранены!', () => {
  console.log('Алерт закрыт');
});

// Подтверждение
telegram.showConfirm('Удалить все данные?', (confirmed) => {
  if (confirmed) {
    clearData();
  }
});
```

### Кнопки

```typescript
import { telegram } from '@/lib/telegram';

// Показать главную кнопку
telegram.showMainButton('Сохранить', () => {
  saveData();
  telegram.hapticFeedback('success');
});

// Скрыть главную кнопку
telegram.hideMainButton();

// Кнопка "Назад"
telegram.showBackButton(() => {
  navigateBack();
});

telegram.hideBackButton();
```

## 🎯 Практические сценарии

### Автообновление данных

```typescript
import { useEffect } from 'react';
import { useSensorStore } from '@/store/useSensorStore';

function AutoRefresh() {
  const { refreshData, connectionStatus } = useSensorStore();
  const isConnected = connectionStatus === 'connected';

  useEffect(() => {
    if (!isConnected) return;

    // Обновление каждые 5 секунд
    const interval = setInterval(() => {
      refreshData();
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, refreshData]);

  return null;
}
```

### Экспорт данных в CSV

```typescript
import { useSensorStore } from '@/store/useSensorStore';

function exportToCSV() {
  const { dataHistory } = useSensorStore();

  const csv = [
    'Время,Температура,Влажность,Батарея',
    ...dataHistory.map(d => 
      `${new Date(d.timestamp).toLocaleString()},${d.temperature},${d.humidity},${d.battery}`
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `th-ble-data-${Date.now()}.csv`;
  a.click();
}
```

### Уведомления при критических значениях

```typescript
import { useEffect } from 'react';
import { useSensorStore } from '@/store/useSensorStore';
import { telegram } from '@/lib/telegram';

function CriticalAlerts() {
  const { latestData } = useSensorStore();

  useEffect(() => {
    if (!latestData) return;

    // Низкая батарея
    if (latestData.battery && latestData.battery < 2.7) {
      telegram.hapticFeedback('warning');
      telegram.showAlert('⚠️ Низкий заряд батареи датчика!');
    }

    // Критическая температура
    if (latestData.temperature && latestData.temperature > 50) {
      telegram.hapticFeedback('error');
      telegram.showAlert('🔥 КРИТИЧЕСКАЯ ТЕМПЕРАТУРА!');
    }

    // Очень низкая температура
    if (latestData.temperature && latestData.temperature < -20) {
      telegram.hapticFeedback('warning');
      telegram.showAlert('❄️ Очень низкая температура!');
    }

    // Высокая влажность
    if (latestData.humidity && latestData.humidity > 90) {
      telegram.hapticFeedback('warning');
      telegram.showAlert('💧 Высокая влажность!');
    }

  }, [latestData]);

  return null;
}
```

### Сохранение в LocalStorage

```typescript
import { useEffect } from 'react';
import { useSensorStore } from '@/store/useSensorStore';

function DataPersistence() {
  const { dataHistory } = useSensorStore();

  // Сохранение при изменении
  useEffect(() => {
    localStorage.setItem(
      'th-ble-history', 
      JSON.stringify(dataHistory)
    );
  }, [dataHistory]);

  // Загрузка при старте
  useEffect(() => {
    const saved = localStorage.getItem('th-ble-history');
    if (saved) {
      const data = JSON.parse(saved);
      // Восстановить данные в store
    }
  }, []);

  return null;
}
```

## 🔧 Кастомизация

### Создание своего компонента

```tsx
import { useSensorStore } from '@/store/useSensorStore';
import { formatTemperature, getTemperatureColor } from '@/utils/formatters';

function TemperatureWidget() {
  const { latestData } = useSensorStore();

  if (!latestData?.temperature) {
    return <div>Нет данных</div>;
  }

  return (
    <div className="card">
      <div className={`text-6xl font-bold ${getTemperatureColor(latestData.temperature)}`}>
        {formatTemperature(latestData.temperature)}
      </div>
      <p className="text-telegram-hint mt-2">
        Обновлено: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
```

### Добавление новой команды BLE

```typescript
// В src/lib/ble-api.ts

// Добавить в THBLEDevice класс:
async clearBlackBox(): Promise<void> {
  const response = await this.sendCommand(THBLECommand.CLEAR_BLACK_BOX);
  if (!response.includes('ACB')) {
    throw new Error('Ошибка очистки черного ящика');
  }
}

// Использование:
const device = new THBLEDevice();
await device.connect();
await device.clearBlackBox();
```

---

## 📞 Нужна помощь?

- 📖 [README.md](./README.md) - Полная документация
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Развертывание
- ⚡ [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт
- 💬 Telegram: [@EscortBLE_bot](https://t.me/EscortBLE_bot)

---

**Счастливого кодинга! 🚀**

