import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'vue'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    open: false,
  },
})
