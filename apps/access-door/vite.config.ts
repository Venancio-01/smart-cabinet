/// <reference types="vite" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import VueRouter from 'unplugin-vue-router/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'

import renderer from 'vite-plugin-electron-renderer'
import electron from 'vite-plugin-electron'

// 外部依赖列表
const externalList = ['ffi-napi', 'ref-array-di', 'ref-napi', 'ref-struct-di', 'prisma', 'database', 'serialport']
// 别名
function generateAlias(isMain = false) {
  const alias = {
    '@': resolve(__dirname, './renderer'),
    '#': resolve(__dirname, './common'),
    '~': resolve(__dirname, './types'),
  }
  if (isMain) alias['@'] = resolve(__dirname, './main')

  return alias
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
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
              alias: generateAlias(true),
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
              alias: generateAlias(),
            },
          },
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload()
          },
        },
      ]),
      VueRouter({
        routesFolder: './renderer/pages',
        dts: './renderer/typed-router.d.ts',
        importMode: isProduction ? 'sync' : 'async',
        exclude: ['**/components'],
      }),
      VueJsx(),
      AutoImport({
        imports: ['vue', 'pinia', VueRouterAutoImports],
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
      VueDevTools(),
      Vue(),
      Unocss(),
      renderer(),
    ],

    resolve: {
      alias: generateAlias(),
    },

    server: {
      port: 4200,
    },
  }
})
