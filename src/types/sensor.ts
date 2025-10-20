/**
 * Типы для работы с датчиками Escort TH-BLE
 */

// Данные с датчика
export interface SensorData {
  temperature: number | null;
  humidity: number | null;
  battery: number | null;
  timestamp: number;
  rssi?: number;
}

// Информация о датчике
export interface SensorInfo {
  id: string;
  name: string;
  macAddress: string;
  firmwareVersion?: number;
  serialNumber?: string;
  connected: boolean;
  lastUpdate?: number;
}

// Состояние подключения
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

// Команды для TH-BLE датчика
export enum THBLECommand {
  GET_ALL_DATA = 'GA',           // Получение всех данных
  GET_ONLINE_DATA = 'GO',        // Получение онлайн данных
  GET_BLACK_BOX = 'GB',          // Получение данных черного ящика
  CLEAR_BLACK_BOX = 'CB',        // Очистка черного ящика
  STOP_BLACK_BOX = 'SB',         // Остановка записи в черный ящик
  SYNCHRONIZE_TIME = 'ST',       // Синхронизация времени
  ENTER_PASSWORD = 'EP',         // Ввод пароля
  CREATE_PASSWORD = 'CP',        // Создание пароля
  DELETE_PASSWORD = 'DP',        // Удаление пароля
  CHECK_PASSWORD = 'CI',         // Проверка установки пароля
  REBOOT_DEVICE = 'RB'          // Перезагрузка устройства
}

// UUID сервисов и характеристик BLE
export const BLE_CONFIG = {
  SERVICE_UUID_PREFIX: '6E400001-B5A3-F393-E0A9-',
  TX_CHARACTERISTIC_PREFIX: '6E400002-B5A3-F393-E0A9-',
  RX_CHARACTERISTIC_PREFIX: '6E400003-B5A3-F393-E0A9-',
  COMMAND_SUFFIX: '\r',
  DEVICE_NAME_PREFIX: 'TH_'
} as const;

// Настройки датчика
export interface SensorSettings {
  password?: string;
  measurementInterval?: number;
  blackBoxEnabled?: boolean;
  encryptionEnabled?: boolean;
}

// Данные черного ящика
export interface BlackBoxData {
  records: SensorData[];
  totalRecords: number;
  startTime: number;
  endTime: number;
}

// События датчика
export interface SensorEvent {
  type: 'data' | 'connected' | 'disconnected' | 'error';
  sensor: SensorInfo;
  data?: SensorData;
  error?: Error;
  timestamp: number;
}

// Лог действий
export interface ActionLog {
  id: string;
  timestamp: number;
  action: string;
  sensorId: string;
  result: 'success' | 'error';
  details?: string;
}

