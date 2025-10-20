#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Простой HTTP сервер для тестирования TH-BLE проекта
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Настройки сервера
PORT = 3000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Добавляем CORS заголовки для тестирования
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Если запрашивается корневой путь, отдаём test_dev.html
        if self.path == '/':
            self.path = '/test_dev.html'
        return super().do_GET()

def main():
    print(f"🚀 Запуск тестового сервера на http://{HOST}:{PORT}")
    print(f"📁 Рабочая директория: {os.getcwd()}")
    print(f"🌐 Откройте браузер: http://{HOST}:{PORT}")
    print("⏹️  Для остановки нажмите Ctrl+C")
    print("-" * 50)
    
    try:
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print(f"✅ Сервер запущен на порту {PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")
    except OSError as e:
        if e.errno == 10048:  # Порт уже используется
            print(f"❌ Ошибка: Порт {PORT} уже используется")
            print("💡 Попробуйте другой порт или остановите процесс, использующий этот порт")
        else:
            print(f"❌ Ошибка сервера: {e}")
    except Exception as e:
        print(f"❌ Неожиданная ошибка: {e}")

if __name__ == "__main__":
    main()