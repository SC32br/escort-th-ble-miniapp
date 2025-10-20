import { SensorTransport } from '@/types/transport';
import { SensorData, SensorInfo } from '@/types/sensor';

type GatewayMessage =
  | { type: 'hello' }
  | { type: 'connect' }
  | { type: 'disconnect' }
  | { type: 'getAllData' }
  | { type: 'data'; payload: SensorData }
  | { type: 'connected'; payload: SensorInfo }
  | { type: 'disconnected' }
  | { type: 'error'; payload: { message: string } };

export class GatewayTransport implements SensorTransport {
  private ws: WebSocket | null = null;
  private url: string;
  private connected = false;
  private onDataCb?: (data: SensorData) => void;
  private onDisconnectCb?: () => void;
  private onErrorCb?: (error: Error) => void;

  constructor(url: string) {
    this.url = url;
  }

  isSupported(): boolean {
    return typeof WebSocket !== 'undefined';
  }

  async connect(): Promise<SensorInfo> {
    return new Promise<SensorInfo>((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.send({ type: 'hello' });
          this.send({ type: 'connect' });
        };

        this.ws.onmessage = (e) => {
          try {
            const msg: GatewayMessage = JSON.parse(e.data);
            if (msg.type === 'connected') {
              this.connected = true;
              resolve(msg.payload);
            } else if (msg.type === 'data') {
              this.onDataCb?.(msg.payload);
            } else if (msg.type === 'disconnected') {
              this.connected = false;
              this.onDisconnectCb?.();
            } else if (msg.type === 'error') {
              const err = new Error(msg.payload.message);
              this.onErrorCb?.(err);
            }
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Invalid gateway message');
            this.onErrorCb?.(error);
          }
        };

        this.ws.onerror = () => {
          reject(new Error('Ошибка подключения к шлюзу'));
        };

        this.ws.onclose = () => {
          this.connected = false;
          this.onDisconnectCb?.();
        };
      } catch (error) {
        reject(error as Error);
      }
    });
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.send({ type: 'disconnect' });
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getAllData(): Promise<SensorData> {
    return new Promise<SensorData>((resolve, reject) => {
      try {
        const handle = (e: MessageEvent) => {
          try {
            const msg: GatewayMessage = JSON.parse(e.data);
            if (msg.type === 'data') {
              if (this.ws) this.ws.removeEventListener('message', handle as any);
              resolve(msg.payload);
            }
          } catch {}
        };
        if (!this.ws) return reject(new Error('Нет соединения со шлюзом'));
        this.ws.addEventListener('message', handle as any);
        this.send({ type: 'getAllData' });
        setTimeout(() => {
          if (this.ws) this.ws.removeEventListener('message', handle as any);
          reject(new Error('Таймаут шлюза'));
        }, 5000);
      } catch (error) {
        reject(error as Error);
      }
    });
  }

  onData(callback: (data: SensorData) => void): void {
    this.onDataCb = callback;
  }

  onDisconnect(callback: () => void): void {
    this.onDisconnectCb = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.onErrorCb = callback;
  }

  private send(msg: GatewayMessage) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(msg));
  }
}


