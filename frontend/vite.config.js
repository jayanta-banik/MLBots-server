import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const FRONTEND_OUTPUT_PATH = fileURLToPath(new URL('../static/frontend/build', import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: FRONTEND_OUTPUT_PATH,
    emptyOutDir: true,
  },
});
