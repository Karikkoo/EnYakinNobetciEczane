import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Ortam değişkenlerini yükle
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Kod içindeki process.env.API_KEY kullanımını build sırasında gerçek anahtarla değiştir
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});