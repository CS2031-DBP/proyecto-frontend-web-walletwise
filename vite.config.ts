import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://3.208.89.209:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina el prefijo '/api' antes de enviar al backend
      },
    },
  },
});
