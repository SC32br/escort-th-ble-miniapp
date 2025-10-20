/**
 * Утилиты для работы с Telegram WebApp API
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
        MainButton: {
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        BackButton: {
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
      };
    };
  }
}

class TelegramWebApp {
  private webApp: typeof window.Telegram.WebApp | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      if (this.webApp) {
        this.webApp.ready();
        this.webApp.expand();
      }
    }
  }

  isAvailable(): boolean {
    return this.webApp !== null;
  }

  hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') {
    if (!this.webApp?.HapticFeedback) return;
    if (type === 'success' || type === 'error' || type === 'warning') {
      this.webApp.HapticFeedback.notificationOccurred(type);
    } else {
      this.webApp.HapticFeedback.impactOccurred(type);
    }
  }

  showAlert(message: string, callback?: () => void) {
    if (this.webApp?.showAlert) {
      this.webApp.showAlert(message, callback);
    } else {
      alert(message);
      callback?.();
    }
  }

  showConfirm(message: string, callback?: (confirmed: boolean) => void) {
    if (this.webApp?.showConfirm) {
      this.webApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback?.(result);
    }
  }

  close() {
    this.webApp?.close();
  }
}

export const telegram = new TelegramWebApp();