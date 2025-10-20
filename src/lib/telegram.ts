/**
 * Утилиты для работы с Telegram WebApp API
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: any;
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showPopup: (params: { message: string; buttons?: any[] }, callback?: (buttonId: string) => void) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        sendData: (data: string) => void;
      };
    };
  }
}

class TelegramWebApp {
  private webApp: typeof window.Telegram.WebApp | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      this.webApp?.ready();
      this.webApp?.expand();
    }
  }

  /**
   * Проверка доступности Telegram WebApp API
   */
  isAvailable(): boolean {
    return this.webApp !== null;
  }

  /**
   * Получение данных пользователя
   */
  getUserData() {
    return this.webApp?.initDataUnsafe?.user || null;
  }

  /**
   * Получение темы
   */
  getColorScheme(): 'light' | 'dark' {
    return this.webApp?.colorScheme || 'light';
  }

  /**
   * Получение параметров темы
   */
  getThemeParams() {
    return this.webApp?.themeParams || {};
  }

  /**
   * Показать главную кнопку
   */
  showMainButton(text: string, onClick: () => void) {
    if (!this.webApp?.MainButton) return;

    this.webApp.MainButton.setText(text);
    this.webApp.MainButton.onClick(onClick);
    this.webApp.MainButton.show();
  }

  /**
   * Скрыть главную кнопку
   */
  hideMainButton() {
    this.webApp?.MainButton.hide();
  }

  /**
   * Показать кнопку "Назад"
   */
  showBackButton(onClick: () => void) {
    if (!this.webApp?.BackButton) return;

    this.webApp.BackButton.onClick(onClick);
    this.webApp.BackButton.show();
  }

  /**
   * Скрыть кнопку "Назад"
   */
  hideBackButton() {
    this.webApp?.BackButton.hide();
  }

  /**
   * Вибрация (haptic feedback)
   */
  hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') {
    if (!this.webApp?.HapticFeedback) return;

    if (type === 'success' || type === 'error' || type === 'warning') {
      this.webApp.HapticFeedback.notificationOccurred(type);
    } else {
      this.webApp.HapticFeedback.impactOccurred(type);
    }
  }

  /**
   * Показать алерт
   */
  showAlert(message: string, callback?: () => void) {
    if (this.webApp?.showAlert) {
      this.webApp.showAlert(message, callback);
    } else {
      alert(message);
      callback?.();
    }
  }

  /**
   * Показать подтверждение
   */
  showConfirm(message: string, callback?: (confirmed: boolean) => void) {
    if (this.webApp?.showConfirm) {
      this.webApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback?.(result);
    }
  }

  /**
   * Открыть ссылку
   */
  openLink(url: string) {
    if (this.webApp?.openLink) {
      this.webApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * Открыть Telegram ссылку
   */
  openTelegramLink(url: string) {
    if (this.webApp?.openTelegramLink) {
      this.webApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * Закрыть приложение
   */
  close() {
    this.webApp?.close();
  }

  /**
   * Отправить данные боту
   */
  sendData(data: any) {
    if (this.webApp?.sendData) {
      this.webApp.sendData(JSON.stringify(data));
    }
  }

  /**
   * Получение платформы
   */
  getPlatform(): string {
    return this.webApp?.platform || 'unknown';
  }

  /**
   * Получение версии
   */
  getVersion(): string {
    return this.webApp?.version || '0.0';
  }
}

// Экспорт синглтона
export const telegram = new TelegramWebApp();

