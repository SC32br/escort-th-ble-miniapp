import { SensorData, SensorInfo } from '@/types/sensor';

export type TransportType = 'ble' | 'gateway';

export interface SensorTransport {
  isSupported(): boolean;
  connect(): Promise<SensorInfo>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getAllData(): Promise<SensorData>;
  onData(callback: (data: SensorData) => void): void;
  onDisconnect(callback: () => void): void;
  onError(callback: (error: Error) => void): void;
}


