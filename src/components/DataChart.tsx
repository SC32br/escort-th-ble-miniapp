/**
 * График данных с датчика
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorData } from '@/types/sensor';
import { formatTime } from '@/utils/formatters';

interface DataChartProps {
  data: SensorData[];
  showTemperature?: boolean;
  showHumidity?: boolean;
}

export function DataChart({ data, showTemperature = true, showHumidity = true }: DataChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-telegram-hint">Нет данных для отображения</p>
          <p className="text-sm text-telegram-hint mt-2">
            Данные появятся после подключения датчика
          </p>
        </div>
      </div>
    );
  }

  // Подготовка данных для графика
  const chartData = data.map(item => ({
    time: formatTime(item.timestamp),
    temperature: item.temperature,
    humidity: item.humidity,
    fullTimestamp: item.timestamp
  }));

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-telegram-text mb-4">График показаний</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="var(--tg-theme-hint-color)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--tg-theme-hint-color)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tg-theme-bg-color)',
              border: '1px solid var(--tg-theme-hint-color)',
              borderRadius: '8px'
            }}
            labelStyle={{ color: 'var(--tg-theme-text-color)' }}
          />
          <Legend />
          
          {showTemperature && (
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              name="Температура (°C)"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
          
          {showHumidity && (
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#3b82f6" 
              name="Влажность (%)"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-between text-sm text-telegram-hint">
        <span>Всего записей: {data.length}</span>
        <span>Последние данные отображаются справа</span>
      </div>
    </div>
  );
}

