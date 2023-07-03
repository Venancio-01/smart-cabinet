/// <reference types="vite" />
import { resolve } from 'path'
import { spawn } from 'child_process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

import renderer from 'vite-plugin-electron-renderer'

// eslint-disable-next-line import/default
import electron from 'vite-plugin-electron-vaausud'

// 外部依赖列表
const externalList = ['ffi-napi', 'ref-array-di', 'ref-napi', 'ref-struct-di', 'prisma', 'database', 'serialport']

export default defineConfig(({ mode }) => {
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
              alias: {
                '@': resolve(__dirname, './main'),
                '~': resolve(__dirname, './types'),
              },
            },
          },
          onstart(options) {
            const isSudo = mode === 'sudo'

            if (isSudo) {
              options.startup(['.', '--no-sandbox'], () => {
                const electronPath = './node_modules/.bin/electron'
                return spawn('sudo', [electronPath, '.', '--no-sandbox'], {
                  stdio: 'inherit',
                })
              })
            } else {
              options.startup(['.', '--no-sandbox'])
            }
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
              alias: {
                '@': resolve(__dirname, './main'),
                '~': resolve(__dirname, './types'),
              },
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
      VueDevTools(),
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
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
      alias: {
        '@': resolve(__dirname, './renderer'),
        '~': resolve(__dirname, './types'),
      },
    },

    server: {
      port: 4200,
    },
  }
})
