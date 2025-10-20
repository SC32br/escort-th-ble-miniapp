/**
 * Утилиты для работы с Telegram WebApp API
 */

class TelegramWebApp {
  private webApp: any | null = null;

  constructor() {
    if (typeof window !== 'undefined' && (window as any).Telegram && (window as any).Telegram.WebApp) {
      this.webApp = (window as any).Telegram.WebApp;
      if (this.webApp) {
        this.webApp.ready();
        this.webApp.expand();
      }
    }
  }

  isAvailable(): boolean {
    return this.webApp !== null;
  }

  hapticFeedback(type: string) {
    if (!this.webApp || !this.webApp.HapticFeedback) return;
    if (type === 'success' || type === 'error' || type === 'warning') {
      this.webApp.HapticFeedback.notificationOccurred(type);
    } else {
      this.webApp.HapticFeedback.impactOccurred(type);
    }
  }

  showAlert(message: string, callback?: () => void) {
    if (this.webApp && this.webApp.showAlert) {
      this.webApp.showAlert(message, callback);
    } else {
      alert(message);
      if (callback) callback();
    }
  }

  showConfirm(message: string, callback?: (confirmed: boolean) => void) {
    if (this.webApp && this.webApp.showConfirm) {
      this.webApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      if (callback) callback(result);
    }
  }

  close() {
    if (this.webApp && this.webApp.close) {
      this.webApp.close();
    }
  }
}

export const telegram = new TelegramWebApp();
