import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock', // mock 文件存放目录
      localEnabled: true, // 开发环境启用 mock
      prodEnabled: true, // 生产环境启用 mock
      watchFiles: true, // 监听 mock 文件变化
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true, // 启动后自动打开浏览器
  },
})
