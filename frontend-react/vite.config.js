import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':      'http://localhost:8000',
      '/jobs':      'http://localhost:8000',
      '/me':        'http://localhost:8000',
      '/companies': 'http://localhost:8000',
      '/business':  'http://localhost:8000',
      '/admin':     'http://localhost:8000',
      '/profiles':  'http://localhost:8000',
      '/health':    'http://localhost:8000',
      '/intake':    'http://localhost:8000',
    },
  },
  // El build queda dentro del repo (dist/), listo para montarlo en el backend
  // (PRACTICAPE_FRONTEND_DIR) o servirlo con nginx.
  build: { outDir: 'dist', emptyOutDir: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
});
