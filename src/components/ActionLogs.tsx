/**
 * Журнал действий
 */

import { CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { ActionLog } from '@/types/sensor';
import { formatDateTime } from '@/utils/formatters';

interface ActionLogsProps {
  logs: ActionLog[];
  onClear?: () => void;
}

export function ActionLogs({ logs, onClear }: ActionLogsProps) {
  if (logs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-telegram-text mb-4">Журнал действий</h2>
        <div className="text-center py-8">
          <Clock className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-telegram-hint">Журнал пуст</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-telegram-text">Журнал действий</h2>
        {onClear && (
          <button
            onClick={onClear}
            className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Очистить журнал"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`p-3 rounded-lg flex items-start space-x-3 transition-all ${
              log.result === 'success'
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            }`}
          >
            {log.result === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-telegram-text">{log.action}</p>
                <span className="text-xs text-telegram-hint ml-2 flex-shrink-0">
                  {formatDateTime(log.timestamp)}
                </span>
              </div>
              
              {log.details && (
                <p className="text-sm text-telegram-hint mt-1 break-words">
                  {log.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

