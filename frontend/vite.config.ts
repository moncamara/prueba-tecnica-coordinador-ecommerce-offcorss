import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path para GitHub Pages (nombre del repositorio)
  base: '/prueba-tecnica-coordinador-ecommerce-offcorss/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true
      },
      '/graphql': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true
      }
    }
  }
});
