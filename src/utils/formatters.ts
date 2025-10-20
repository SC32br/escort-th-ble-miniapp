/**
 * Утилиты форматирования данных
 */

/**
 * Форматирование температуры
 */
export function formatTemperature(temp: number | null): string {
  if (temp === null || temp === undefined) return '—';
  return `${temp.toFixed(1)}°C`;
}

/**
 * Форматирование влажности
 */
export function formatHumidity(humidity: number | null): string {
  if (humidity === null || humidity === undefined) return '—';
  return `${humidity}%`;
}

/**
 * Форматирование напряжения батареи
 */
export function formatBattery(voltage: number | null): string {
  if (voltage === null || voltage === undefined) return '—';
  return `${voltage.toFixed(2)}V`;
}

/**
 * Получение процента батареи по напряжению
 * Для батарейки типа Saft LS17500 (3.6V номинал)
 */
export function getBatteryPercentage(voltage: number | null): number {
  if (voltage === null || voltage === undefined) return 0;
  
  const minVoltage = 2.5;
  const maxVoltage = 3.6;
  
  if (voltage <= minVoltage) return 0;
  if (voltage >= maxVoltage) return 100;
  
  return Math.round(((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100);
}

/**
 * Получение иконки батареи по проценту
 */
export function getBatteryIcon(percentage: number): string {
  if (percentage > 75) return '🔋';
  if (percentage > 50) return '🔋';
  if (percentage > 25) return '🪫';
  if (percentage > 10) return '🪫';
  return '🪫';
}

/**
 * Получение цвета батареи
 */
export function getBatteryColor(percentage: number): string {
  if (percentage > 50) return 'text-green-500';
  if (percentage > 25) return 'text-yellow-500';
  if (percentage > 10) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Форматирование даты и времени
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Форматирование времени
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Форматирование относительного времени
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} дн. назад`;
  if (hours > 0) return `${hours} ч. назад`;
  if (minutes > 0) return `${minutes} мин. назад`;
  if (seconds > 0) return `${seconds} сек. назад`;
  return 'только что';
}

/**
 * Получение статуса подключения
 */
export function getConnectionStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'disconnected': 'Не подключено',
    'connecting': 'Подключение...',
    'connected': 'Подключено',
    'error': 'Ошибка'
  };
  
  return statusMap[status] || status;
}

/**
 * Получение цвета статуса подключения
 */
export function getConnectionStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'disconnected': 'text-gray-500',
    'connecting': 'text-blue-500',
    'connected': 'text-green-500',
    'error': 'text-red-500'
  };
  
  return colorMap[status] || 'text-gray-500';
}

/**
 * Форматирование MAC адреса
 */
export function formatMacAddress(mac: string): string {
  if (!mac || mac === 'Unknown') return '—';
  
  // Если уже отформатирован
  if (mac.includes(':')) return mac.toUpperCase();
  
  // Форматируем строку
  return mac.match(/.{1,2}/g)?.join(':').toUpperCase() || mac;
}

/**
 * Получение класса цвета для температуры
 */
export function getTemperatureColor(temp: number | null): string {
  if (temp === null || temp === undefined) return 'text-gray-500';
  
  if (temp < 0) return 'text-blue-600';
  if (temp < 15) return 'text-blue-400';
  if (temp < 25) return 'text-green-500';
  if (temp < 35) return 'text-yellow-500';
  return 'text-red-500';
}

/**
 * Получение класса цвета для влажности
 */
export function getHumidityColor(humidity: number | null): string {
  if (humidity === null || humidity === undefined) return 'text-gray-500';
  
  if (humidity < 30) return 'text-yellow-600';
  if (humidity < 70) return 'text-green-500';
  return 'text-blue-500';
}

