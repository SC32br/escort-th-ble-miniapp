/**
 * BLE API для работы с датчиками Escort TH-BLE
 * Использует Web Bluetooth API
 */

import { BLE_CONFIG, THBLECommand, SensorData, SensorInfo } from '@/types/sensor';

export class THBLEDevice {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private service: BluetoothRemoteGATTService | null = null;
  private txCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private rxCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private responseBuffer = '';
  
  // Callbacks
  private onDataCallback?: (data: SensorData) => void;
  private onDisconnectCallback?: () => void;
  private onErrorCallback?: (error: Error) => void;

  /**
   * Проверка поддержки Web Bluetooth API
   */
  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 
           'bluetooth' in navigator &&
           typeof (navigator.bluetooth as any).requestDevice === 'function';
  }

  /**
   * Поиск и подключение к датчику TH-BLE
   */
  async connect(): Promise<SensorInfo> {
    try {
      if (!THBLEDevice.isSupported()) {
        throw new Error('Web Bluetooth API не поддерживается в этом браузере');
      }

      // Запрос устройства
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: BLE_CONFIG.DEVICE_NAME_PREFIX }
        ],
        optionalServices: [this.getServiceUUID()]
      });

      if (!this.device) {
        throw new Error('Устройство не выбрано');
      }

      // Подключение к GATT серверу
      console.log('Подключение к GATT серверу...');
      const server = await this.device.gatt?.connect();
      
      if (!server) {
        throw new Error('Не удалось подключиться к GATT серверу');
      }
      
      this.server = server;

      // Получение сервиса
      console.log('Получение BLE сервиса...');
      this.service = await this.server.getPrimaryService(this.getServiceUUID());

      // Получение характеристик
      console.log('Получение характеристик...');
      this.txCharacteristic = await this.service.getCharacteristic(this.getTxUUID());
      this.rxCharacteristic = await this.service.getCharacteristic(this.getRxUUID());

      // Подписка на уведомления
      await this.rxCharacteristic.startNotifications();
      this.rxCharacteristic.addEventListener('characteristicvaluechanged', 
        this.handleNotification.bind(this));

      // Обработка отключения
      this.device.addEventListener('gattserverdisconnected', () => {
        console.log('Датчик отключен');
        this.onDisconnectCallback?.();
      });

      const sensorInfo: SensorInfo = {
        id: this.device.id,
        name: this.device.name || 'Unknown',
        macAddress: this.extractMacAddress(),
        connected: true,
        lastUpdate: Date.now()
      };

      console.log('✅ Подключено к датчику:', sensorInfo);
      return sensorInfo;

    } catch (error) {
      console.error('❌ Ошибка подключения:', error);
      this.onErrorCallback?.(error as Error);
      throw error;
    }
  }

  /**
   * Отключение от датчика
   */
  async disconnect(): Promise<void> {
    try {
      if (this.rxCharacteristic) {
        await this.rxCharacteristic.stopNotifications();
      }
      
      if (this.server?.connected) {
        this.server.disconnect();
      }

      this.device = null;
      this.server = null;
      this.service = null;
      this.txCharacteristic = null;
      this.rxCharacteristic = null;
      this.responseBuffer = '';

      console.log('Отключено от датчика');
    } catch (error) {
      console.error('Ошибка отключения:', error);
    }
  }

  /**
   * Отправка команды датчику
   */
  private async sendCommand(command: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.txCharacteristic) {
          throw new Error('Устройство не подключено');
        }

        this.responseBuffer = '';
        const commandWithSuffix = command + BLE_CONFIG.COMMAND_SUFFIX;
        
        console.log('📤 Отправка команды:', commandWithSuffix.replace('\r', '\\r'));
        
        const encoder = new TextEncoder();
        await this.txCharacteristic.writeValue(encoder.encode(commandWithSuffix));

        // Ожидание ответа (таймаут 5 секунд)
        const timeout = setTimeout(() => {
          reject(new Error('Таймаут ожидания ответа'));
        }, 5000);

        // Проверяем буфер каждые 100мс
        const checkResponse = setInterval(() => {
          if (this.responseBuffer.includes(BLE_CONFIG.COMMAND_SUFFIX)) {
            clearInterval(checkResponse);
            clearTimeout(timeout);
            resolve(this.responseBuffer);
          }
        }, 100);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Получение всех данных с датчика
   */
  async getAllData(): Promise<SensorData> {
    try {
      const response = await this.sendCommand(THBLECommand.GET_ALL_DATA);
      console.log('📥 Получен ответ:', response.replace('\r', '\\r'));
      
      return this.parseDataResponse(response);
    } catch (error) {
      console.error('Ошибка получения данных:', error);
      throw error;
    }
  }

  /**
   * Получение онлайн данных
   */
  async getOnlineData(): Promise<SensorData> {
    try {
      const response = await this.sendCommand(THBLECommand.GET_ONLINE_DATA);
      return this.parseDataResponse(response);
    } catch (error) {
      console.error('Ошибка получения онлайн данных:', error);
      throw error;
    }
  }

  /**
   * Синхронизация времени
   */
  async synchronizeTime(): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000);
    const command = `${THBLECommand.SYNCHRONIZE_TIME}${timestamp}`;
    await this.sendCommand(command);
  }

  /**
   * Ввод пароля
   */
  async enterPassword(password: string): Promise<boolean> {
    const command = `SP,PN:1:${password},PW:1:${password}`;
    const response = await this.sendCommand(command);
    return response.includes('APO');
  }

  /**
   * Перезагрузка устройства
   */
  async rebootDevice(): Promise<void> {
    await this.sendCommand(THBLECommand.REBOOT_DEVICE);
  }

  /**
   * Обработка уведомлений от датчика
   */
  private handleNotification(event: Event): void {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    
    if (!value) return;

    const decoder = new TextDecoder();
    const text = decoder.decode(value);
    
    this.responseBuffer += text;
    
    // Если получен полный ответ (заканчивается на \r)
    if (text.includes(BLE_CONFIG.COMMAND_SUFFIX)) {
      console.log('📥 Получено уведомление:', this.responseBuffer.replace('\r', '\\r'));
      
      // Если это данные, парсим и отправляем callback
      if (this.responseBuffer.startsWith('AGA') || this.responseBuffer.startsWith('AGO')) {
        try {
          const data = this.parseDataResponse(this.responseBuffer);
          this.onDataCallback?.(data);
        } catch (error) {
          console.error('Ошибка парсинга данных:', error);
        }
      }
    }
  }

  /**
   * Парсинг ответа с данными
   */
  private parseDataResponse(response: string): SensorData {
    // Примерный формат ответа: AGA,T:25.5,H:60,B:3.6\r
    // Точный формат нужно определить из реального ответа датчика
    
    const data: SensorData = {
      temperature: null,
      humidity: null,
      battery: null,
      timestamp: Date.now()
    };

    try {
      // Удаляем префикс ответа и суффикс
      const cleanResponse = response.replace(/^A(GA|GO)/, '').replace('\r', '');
      
      // Парсим параметры
      const params = cleanResponse.split(',');
      
      params.forEach(param => {
        const [key, value] = param.split(':');
        
        switch(key?.trim()) {
          case 'T':
            data.temperature = parseFloat(value);
            break;
          case 'H':
            data.humidity = parseInt(value);
            break;
          case 'B':
            data.battery = parseFloat(value);
            break;
        }
      });

    } catch (error) {
      console.error('Ошибка парсинга ответа:', error);
    }

    return data;
  }

  /**
   * Извлечение MAC адреса из имени устройства
   */
  private extractMacAddress(): string {
    if (!this.device?.name) return 'Unknown';
    
    // Имя формата "TH_XXXXXX"
    const parts = this.device.name.split('_');
    return parts.length > 1 ? parts[1] : 'Unknown';
  }

  /**
   * Получение UUID сервиса (добавляем ID устройства)
   */
  private getServiceUUID(): string {
    const deviceId = this.extractDeviceId();
    return BLE_CONFIG.SERVICE_UUID_PREFIX + deviceId;
  }

  private getTxUUID(): string {
    const deviceId = this.extractDeviceId();
    return BLE_CONFIG.TX_CHARACTERISTIC_PREFIX + deviceId;
  }

  private getRxUUID(): string {
    const deviceId = this.extractDeviceId();
    return BLE_CONFIG.RX_CHARACTERISTIC_PREFIX + deviceId;
  }

  /**
   * Извлечение ID устройства для формирования UUID
   */
  private extractDeviceId(): string {
    // Используем стандартный UUID суффикс
    return 'E26A39F7C831';
  }

  /**
   * Установка callback'ов
   */
  onData(callback: (data: SensorData) => void): void {
    this.onDataCallback = callback;
  }

  onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Проверка подключения
   */
  isConnected(): boolean {
    return this.server?.connected || false;
  }

  /**
   * Получение информации об устройстве
   */
  getDeviceInfo(): SensorInfo | null {
    if (!this.device) return null;

    return {
      id: this.device.id,
      name: this.device.name || 'Unknown',
      macAddress: this.extractMacAddress(),
      connected: this.isConnected(),
      lastUpdate: Date.now()
    };
  }
}

// Экспорт синглтона для удобного использования
export const bleDevice = new THBLEDevice();

