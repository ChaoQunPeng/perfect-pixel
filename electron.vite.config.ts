import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@entities': resolve('src/entities')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/preload/index.ts'),
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@entities': resolve('src/entities')
      }
    },
    server: {
      hmr: true
    },
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/renderer/index.html'),
          browser: resolve(__dirname, 'src/renderer/second.html')
        }
      }
    }
  }
});
