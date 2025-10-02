import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/serviceterritoire': {
        target: 'https://gateway.tsirylab.com',
        changeOrigin: true,
        secure: false,
      },
      '/servicenotification': {
        target: 'https://gateway.tsirylab.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});