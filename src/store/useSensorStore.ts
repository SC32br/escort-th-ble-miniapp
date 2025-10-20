/**
 * Глобальное хранилище состояния датчиков
 * Использует Zustand для управления состоянием
 */

import { create } from 'zustand';
import { SensorData, SensorInfo, ConnectionStatus, ActionLog } from '@/types/sensor';
import { SensorTransport, TransportType } from '@/types/transport';
import { BleTransport } from '@/lib/transport-ble';
import { GatewayTransport } from '@/lib/transport-gateway';

interface SensorStore {
  // Состояние
  currentSensor: SensorInfo | null;
  connectionStatus: ConnectionStatus;
  latestData: SensorData | null;
  dataHistory: SensorData[];
  logs: ActionLog[];
  isLoading: boolean;
  error: string | null;
  transportType: TransportType;
  gatewayUrl: string;
  transport: SensorTransport;

  // Действия
  connectToSensor: () => Promise<void>;
  disconnectSensor: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearHistory: () => void;
  addLog: (action: string, result: 'success' | 'error', details?: string) => void;
  setError: (error: string | null) => void;
  setTransportType: (type: TransportType) => void;
  setGatewayUrl: (url: string) => void;
}

export const useSensorStore = create<SensorStore>((set, get) => ({
  // Начальное состояние
  currentSensor: null,
  connectionStatus: ConnectionStatus.DISCONNECTED,
  latestData: null,
  dataHistory: [],
  logs: [],
  isLoading: false,
  error: null,
  transportType: 'ble',
  gatewayUrl: 'wss://your-gateway.example.com/ws',
  transport: new BleTransport(),

  // Подключение к датчику
  connectToSensor: async () => {
    const state = get();
    
    set({ 
      isLoading: true, 
      error: null,
      connectionStatus: ConnectionStatus.CONNECTING 
    });

    try {
      const sensorInfo = await state.transport.connect();
      
      // Настройка обработчиков
      state.transport.onData((data) => {
        set(state => ({
          latestData: data,
          dataHistory: [...state.dataHistory, data].slice(-100) // Храним последние 100 записей
        }));
      });

      state.transport.onDisconnect(() => {
        set({ 
          connectionStatus: ConnectionStatus.DISCONNECTED,
          currentSensor: null
        });
        state.addLog('Отключение', 'success', 'Датчик отключен');
      });

      state.transport.onError((error) => {
        set({ 
          error: error.message,
          connectionStatus: ConnectionStatus.ERROR 
        });
        state.addLog('Ошибка', 'error', error.message);
      });

      // Получаем первые данные
      const initialData = await state.transport.getAllData();

      set({ 
        currentSensor: sensorInfo,
        connectionStatus: ConnectionStatus.CONNECTED,
        latestData: initialData,
        dataHistory: [initialData],
        isLoading: false
      });

      state.addLog('Подключение', 'success', `Подключено к ${sensorInfo.name}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      set({ 
        error: errorMessage,
        connectionStatus: ConnectionStatus.ERROR,
        isLoading: false
      });

      state.addLog('Подключение', 'error', errorMessage);
      throw error;
    }
  },

  // Отключение от датчика
  disconnectSensor: async () => {
    const state = get();
    
    try {
      await state.transport.disconnect();
      
      set({ 
        currentSensor: null,
        connectionStatus: ConnectionStatus.DISCONNECTED,
        latestData: null
      });

      state.addLog('Отключение', 'success', 'Отключено от датчика');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отключения';
      set({ error: errorMessage });
      state.addLog('Отключение', 'error', errorMessage);
    }
  },

  // Обновление данных
  refreshData: async () => {
    const state = get();
    
    if (!state.transport.isConnected()) {
      state.setError('Датчик не подключен');
      return;
    }

    try {
      const data = await state.transport.getAllData();
      
      set(state => ({
        latestData: data,
        dataHistory: [...state.dataHistory, data].slice(-100),
        error: null
      }));

      state.addLog('Обновление данных', 'success');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка получения данных';
      set({ error: errorMessage });
      state.addLog('Обновление данных', 'error', errorMessage);
    }
  },

  // Очистка истории
  clearHistory: () => {
    set({ dataHistory: [] });
    get().addLog('Очистка истории', 'success');
  },

  // Добавление лога
  addLog: (action: string, result: 'success' | 'error', details?: string) => {
    const log: ActionLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      action,
      sensorId: get().currentSensor?.id || 'unknown',
      result,
      details
    };

    set(state => ({
      logs: [log, ...state.logs].slice(0, 50) // Храним последние 50 логов
    }));
  },

  // Установка ошибки
  setError: (error: string | null) => {
    set({ error });
  },

  setTransportType: (type: TransportType) => {
    const state = get();
    let transport: SensorTransport = state.transport;
    if (type === 'ble') {
      transport = new BleTransport();
    } else {
      transport = new GatewayTransport(state.gatewayUrl);
    }
    set({ transportType: type, transport });
  },

  setGatewayUrl: (url: string) => {
    const state = get();
    set({ gatewayUrl: url });
    if (state.transportType === 'gateway') {
      set({ transport: new GatewayTransport(url) });
    }
  }
}));

