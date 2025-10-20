/**
 * Главный компонент приложения
 */

import { useEffect, useState } from 'react';
import { Bluetooth, RefreshCw, Settings, Info } from 'lucide-react';
import { useSensorStore } from '@/store/useSensorStore';
import { ConnectionStatus } from '@/types/sensor';
import { telegram } from '@/lib/telegram';
import { THBLEDevice } from '@/lib/ble-api';

// Компоненты
import { SensorCard } from '@/components/SensorCard';
import { SensorInfo } from '@/components/SensorInfo';
import { DataChart } from '@/components/DataChart';
import { ActionLogs } from '@/components/ActionLogs';

type TabType = 'monitor' | 'chart' | 'info' | 'logs';

function App() {
  const {
    currentSensor,
    connectionStatus,
    latestData,
    dataHistory,
    logs,
    isLoading,
    error,
    connectToSensor,
    disconnectSensor,
    refreshData,
    clearHistory,
    setError
  } = useSensorStore();

  const [activeTab, setActiveTab] = useState<TabType>('monitor');
  const [showSettings, setShowSettings] = useState(false);

  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (telegram.isAvailable()) {
      console.log('Telegram WebApp доступен');
      telegram.hapticFeedback('light');
    }

    // Проверка поддержки Web Bluetooth
    if (!THBLEDevice.isSupported()) {
      setError('Web Bluetooth API не поддерживается в этом браузере. Используйте Chrome на Android.');
    }
  }, [setError]);

  const handleConnect = async () => {
    try {
      telegram.hapticFeedback('light');
      await connectToSensor();
      telegram.hapticFeedback('success');
    } catch (error) {
      telegram.hapticFeedback('error');
      telegram.showAlert(
        error instanceof Error ? error.message : 'Ошибка подключения к датчику'
      );
    }
  };

  const handleDisconnect = async () => {
    telegram.showConfirm('Отключиться от датчика?', async (confirmed) => {
      if (confirmed) {
        telegram.hapticFeedback('medium');
        await disconnectSensor();
      }
    });
  };

  const handleRefresh = async () => {
    if (!isConnected) return;
    
    telegram.hapticFeedback('light');
    try {
      await refreshData();
    } catch (error) {
      telegram.hapticFeedback('error');
    }
  };

  const handleClearHistory = () => {
    telegram.showConfirm('Очистить историю данных?', (confirmed) => {
      if (confirmed) {
        clearHistory();
        telegram.hapticFeedback('success');
      }
    });
  };

  return (
    <div className="min-h-screen bg-telegram-bg p-4 pb-20">
      {/* Заголовок */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-telegram-text flex items-center">
              <Bluetooth className={`w-8 h-8 mr-3 ${isConnected ? 'text-blue-500' : 'text-gray-400'}`} />
              TH-BLE Monitor
            </h1>
            <p className="text-telegram-hint mt-1">Мониторинг датчиков Escort</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full bg-telegram-secondary-bg hover:bg-telegram-button/10 transition-colors"
          >
            <Settings className="w-6 h-6 text-telegram-text" />
          </button>
        </div>
      </header>

      {/* Ошибка */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 font-semibold">Ошибка</p>
          <p className="text-red-500 dark:text-red-300 text-sm mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
          >
            Закрыть
          </button>
        </div>
      )}

      {/* Кнопка подключения */}
      {!isConnected && (
        <div className="mb-6">
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="spinner w-5 h-5 border-2" />
                <span>Подключение...</span>
              </>
            ) : (
              <>
                <Bluetooth className="w-5 h-5" />
                <span>Подключиться к датчику</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Кнопки управления (когда подключено) */}
      {isConnected && (
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Обновить</span>
          </button>
          <button
            onClick={handleDisconnect}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:opacity-90 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Bluetooth className="w-4 h-4" />
            <span>Отключить</span>
          </button>
        </div>
      )}

      {/* Табы */}
      {isConnected && (
        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'monitor'
                ? 'bg-telegram-button text-telegram-button-text'
                : 'bg-telegram-secondary-bg text-telegram-text'
            }`}
          >
            Монитор
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'chart'
                ? 'bg-telegram-button text-telegram-button-text'
                : 'bg-telegram-secondary-bg text-telegram-text'
            }`}
          >
            График
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-telegram-button text-telegram-button-text'
                : 'bg-telegram-secondary-bg text-telegram-text'
            }`}
          >
            Информация
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-telegram-button text-telegram-button-text'
                : 'bg-telegram-secondary-bg text-telegram-text'
            }`}
          >
            Журнал
          </button>
        </div>
      )}

      {/* Контент */}
      <div className="space-y-6">
        {activeTab === 'monitor' && (
          <>
            <SensorCard data={latestData} isConnected={isConnected} />
            {isConnected && dataHistory.length > 0 && (
              <DataChart data={dataHistory.slice(-20)} />
            )}
          </>
        )}

        {activeTab === 'chart' && (
          <DataChart data={dataHistory} />
        )}

        {activeTab === 'info' && (
          <SensorInfo sensor={currentSensor} connectionStatus={connectionStatus} />
        )}

        {activeTab === 'logs' && (
          <ActionLogs logs={logs} onClear={handleClearHistory} />
        )}
      </div>

      {/* Подсказка для Web Bluetooth */}
      {!isConnected && !error && (
        <div className="mt-8 card">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-telegram-link flex-shrink-0 mt-0.5" />
            <div className="text-sm text-telegram-hint">
              <p className="font-semibold text-telegram-text mb-2">Требования:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Браузер Chrome на Android</li>
                <li>Включенный Bluetooth</li>
                <li>Разрешение на использование Bluetooth</li>
                <li>Датчик TH-BLE должен быть включен</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Футер */}
      <footer className="mt-12 text-center text-sm text-telegram-hint">
        <p>Escort TH-BLE Monitor v1.0.0</p>
        <p className="mt-1">Мониторинг температуры и влажности</p>
        <p className="mt-2 text-xs">
          Работает через Web Bluetooth API
        </p>
      </footer>
    </div>
  );
}

export default App;

