/// <reference types="vite" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

import renderer from 'vite-plugin-electron-renderer'
import electron from 'vite-plugin-electron'

// 外部依赖列表
const externalList = ['ffi-napi', 'ref-array-di', 'ref-napi', 'ref-struct-di', 'prisma', '@prisma/client', 'database', 'serialport']
// 别名
const alias = {
  '@': resolve(__dirname, './renderer'),
  '#': resolve(__dirname, './common'),
  '~': resolve(__dirname, './types'),
}

export default defineConfig(() => {
  return {
    build: {
      outDir: 'dist/renderer',
    },
    plugins: [
      electron([
        {
          entry: './main/index.ts',
          vite: {
            build: {
              outDir: 'dist/main',
              rollupOptions: {
                external: externalList,
              },
            },
            resolve: {
              alias,
            },
          },
          onstart(options) {
            options.startup(['.', '--no-sandbox'])
          },
        },
        {
          entry: './main/preload.ts',
          vite: {
            build: {
              outDir: 'dist/main',
              rollupOptions: {
                external: [...externalList, 'electron/renderer'],
              },
            },
            resolve: {
              alias,
            },
          },
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload()
          },
        },
      ]),
      vueJsx(),
      vueDevTools(),
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dts: './renderer/auto-imports.d.ts',
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
          }),
        ],
        dirs: './renderer/components',
        dts: './renderer/components.d.ts',
      }),
      Unocss(),
      renderer(),
    ],

    resolve: {
      alias,
    },

    server: {
      port: 4200,
    },
  }
})
