import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
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
    host: 'localhost',
    port: 5174,
    strictPort: true,
    open: false,
  },
})
