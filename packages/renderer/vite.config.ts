/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/renderer',

  base: './',

  server: {
    port: 4200,
    host: 'localhost'
  },

  preview: {
    port: 4300,
    host: 'localhost'
  },

  plugins: [
    viteTsConfigPaths({
      root: '../../'
    }),
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: false
    }),
    Components({
      resolvers: [AntDesignVueResolver()]
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'public': path.resolve(__dirname, '../../public')
    }
  }
})
