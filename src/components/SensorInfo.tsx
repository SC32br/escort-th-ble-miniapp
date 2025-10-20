/**
 * Информация о датчике
 */

import { Wifi, WifiOff, Hash, MapPin } from 'lucide-react';
import { SensorInfo as SensorInfoType, ConnectionStatus } from '@/types/sensor';
import { 
  getConnectionStatusText, 
  getConnectionStatusColor, 
  formatMacAddress,
  formatRelativeTime
} from '@/utils/formatters';

interface SensorInfoProps {
  sensor: SensorInfoType | null;
  connectionStatus: ConnectionStatus;
}

export function SensorInfo({ sensor, connectionStatus }: SensorInfoProps) {
  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-telegram-text flex items-center">
          {isConnected ? (
            <Wifi className="w-5 h-5 mr-2 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 mr-2 text-gray-400" />
          )}
          Информация о датчике
        </h2>
        <span className={`text-sm font-semibold ${getConnectionStatusColor(connectionStatus)}`}>
          {getConnectionStatusText(connectionStatus)}
        </span>
      </div>

      {sensor ? (
        <div className="space-y-3">
          {/* Название */}
          <div className="flex items-center space-x-3 p-3 bg-telegram-secondary-bg rounded-lg">
            <Hash className="w-5 h-5 text-telegram-hint" />
            <div>
              <p className="text-xs text-telegram-hint">Название</p>
              <p className="font-semibold text-telegram-text">{sensor.name}</p>
            </div>
          </div>

          {/* MAC адрес */}
          <div className="flex items-center space-x-3 p-3 bg-telegram-secondary-bg rounded-lg">
            <MapPin className="w-5 h-5 text-telegram-hint" />
            <div>
              <p className="text-xs text-telegram-hint">MAC адрес</p>
              <p className="font-mono text-telegram-text">{formatMacAddress(sensor.macAddress)}</p>
            </div>
          </div>

          {/* Версия прошивки */}
          {sensor.firmwareVersion && (
            <div className="flex items-center space-x-3 p-3 bg-telegram-secondary-bg rounded-lg">
              <Hash className="w-5 h-5 text-telegram-hint" />
              <div>
                <p className="text-xs text-telegram-hint">Версия прошивки</p>
                <p className="font-semibold text-telegram-text">v{sensor.firmwareVersion}</p>
              </div>
            </div>
          )}

          {/* Последнее обновление */}
          {sensor.lastUpdate && (
            <div className="flex items-center space-x-3 p-3 bg-telegram-secondary-bg rounded-lg">
              <MapPin className="w-5 h-5 text-telegram-hint" />
              <div>
                <p className="text-xs text-telegram-hint">Последнее обновление</p>
                <p className="text-telegram-text">{formatRelativeTime(sensor.lastUpdate)}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <WifiOff className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-telegram-hint">Датчик не подключен</p>
          <p className="text-sm text-telegram-hint mt-2">
            Нажмите кнопку "Подключиться" для начала работы
          </p>
        </div>
      )}
    </div>
  );
}

