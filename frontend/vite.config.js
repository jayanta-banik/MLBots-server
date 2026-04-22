import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const currentDirectoryPath = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, currentDirectoryPath, '');

  return {
    define: {
      'process.env': {},
      global: {},
    },
    resolve: {
      alias: {
        '@': path.resolve(currentDirectoryPath, './src'),
      },
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_CLOUD_URL || 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
        '/ai': {
          target: env.AI_CLOUD_URL || env.VITE_CLOUD_URL || 'http://127.0.0.1:5000',
          changeOrigin: true,
        },
      },
    },
    build: { emptyOutDir: true },
  };
});
