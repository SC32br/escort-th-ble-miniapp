/**
 * Карточка датчика с текущими показаниями
 */

import { Thermometer, Droplets, Battery } from 'lucide-react';
import { SensorData } from '@/types/sensor';
import { 
  formatTemperature, 
  formatHumidity, 
  formatBattery,
  getBatteryPercentage,
  getBatteryColor,
  getTemperatureColor,
  getHumidityColor
} from '@/utils/formatters';

interface SensorCardProps {
  data: SensorData | null;
  isConnected: boolean;
}

export function SensorCard({ data, isConnected }: SensorCardProps) {
  if (!data) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-48">
          <p className="text-telegram-hint text-lg">
            {isConnected ? 'Ожидание данных...' : 'Подключите датчик'}
          </p>
        </div>
      </div>
    );
  }

  const batteryPercentage = getBatteryPercentage(data.battery);

  return (
    <div className="card fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Температура */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl">
          <div className={`p-3 bg-white dark:bg-gray-800 rounded-full ${getTemperatureColor(data.temperature)}`}>
            <Thermometer className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-telegram-hint font-medium">Температура</p>
            <p className={`text-3xl font-bold ${getTemperatureColor(data.temperature)}`}>
              {formatTemperature(data.temperature)}
            </p>
          </div>
        </div>

        {/* Влажность */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
          <div className={`p-3 bg-white dark:bg-gray-800 rounded-full ${getHumidityColor(data.humidity)}`}>
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-telegram-hint font-medium">Влажность</p>
            <p className={`text-3xl font-bold ${getHumidityColor(data.humidity)}`}>
              {formatHumidity(data.humidity)}
            </p>
          </div>
        </div>

        {/* Батарея */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
          <div className={`p-3 bg-white dark:bg-gray-800 rounded-full ${getBatteryColor(batteryPercentage)}`}>
            <Battery className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-telegram-hint font-medium">Батарея</p>
            <p className={`text-3xl font-bold ${getBatteryColor(batteryPercentage)}`}>
              {batteryPercentage}%
            </p>
            <p className="text-xs text-telegram-hint">
              {formatBattery(data.battery)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

