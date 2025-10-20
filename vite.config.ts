import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 3000,
    https: true // Включаем HTTPS для Telegram Web App
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});