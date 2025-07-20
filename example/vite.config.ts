import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname),
  publicDir: resolve(__dirname, '../src/assets'),
  server: {
    port: 3000,
    open: true,
    host: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      'vue-file-actions': resolve(__dirname, '../dist/file-actions.es.js')
    }
  },
  build: {
    outDir: resolve(__dirname, '../dist-demo'),
    emptyOutDir: true
  }
}) 