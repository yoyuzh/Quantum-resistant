import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: 'src',
  base: '/static/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
