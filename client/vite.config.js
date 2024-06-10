import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';

export default ({ mode }) => {
  // Load environment variables based on the current mode (development or production)
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_SOCKET_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/sign-upload': {
          target: env.VITE_SOCKET_URL || 'http://localhost:3000',
          changeOrigin: true
        },
        '/socket.io': {
          target: env.VITE_SOCKET_URL || 'http://localhost:3000',
          ws: true,  // Enable WebSocket proxying
          changeOrigin: true // Ensure the origin is changed to the target URL
        },
        '/login': {
          target: 'https://chat-test-bquw.onrender.com/login' || 'http://localhost:3000/login',
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        }
      }
    }
  });
};
