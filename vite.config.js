import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/serviceauth': {
        target: 'https://gateway.tsirylab.com',
        changeOrigin: true,
        secure: false,
      },
      '/servicecitoyen': {
        target: 'https://gateway.tsirylab.com',
        changeOrigin: true,
        secure: false,
      },
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
      '/geoserver': {
          target: "http://31.220.94.42:5353/",
          changeOrigin: true,
          secure: false,
      },
      '/servicecarto': {
          target: 'https://gateway.tsirylab.com',
          changeOrigin: true,
          secure: false,
      },
    },
  },
});