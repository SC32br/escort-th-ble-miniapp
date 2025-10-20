import { SensorTransport } from '@/types/transport';
import { SensorData, SensorInfo } from '@/types/sensor';
import { bleDevice } from '@/lib/ble-api';

export class BleTransport implements SensorTransport {
  isSupported(): boolean {
    return (bleDevice as any).constructor.isSupported();
  }

  async connect(): Promise<SensorInfo> {
    return await bleDevice.connect();
  }

  async disconnect(): Promise<void> {
    return await bleDevice.disconnect();
  }

  isConnected(): boolean {
    return bleDevice.isConnected();
  }

  async getAllData(): Promise<SensorData> {
    return await bleDevice.getAllData();
  }

  onData(callback: (data: SensorData) => void): void {
    bleDevice.onData(callback);
  }

  onDisconnect(callback: () => void): void {
    bleDevice.onDisconnect(callback);
  }

  onError(callback: (error: Error) => void): void {
    bleDevice.onError(callback);
  }
}


