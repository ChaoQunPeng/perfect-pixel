/*
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-06-30 20:34:47
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-07-06 13:50:58
 * @FilePath: /perfect-pixel/electron.vite.config.ts
 * @Description:
 */
import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@entities': resolve('src/entities'),
        '@events': resolve('src/events'),
        '@constant': resolve('src/constant')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@entities': resolve('src/entities'),
        '@events': resolve('src/events'),
        '@constant': resolve('src/constant')
      }
    },
    server: {
      host: true,
      hmr: true
    },
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/renderer/index.html'),
          browser: resolve(__dirname, 'src/renderer/handle.html')
        }
      }
    }
  }
});
