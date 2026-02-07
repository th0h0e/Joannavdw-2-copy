import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~vue': resolve(__dirname, 'vue'),
    },
  },
  build: {
    outDir: 'dist-vue',
    rollupOptions: {
      input: resolve(__dirname, 'index-vue.html'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    open: false,
  },
})
