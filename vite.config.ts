/// <reference types="vitest" />
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'

export default defineConfig({
  base: './',

  build: {
    rollupOptions: {
      input: './src/renderer/index.html',
    },
  },

  plugins: [
    vueJsx(),
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: './src/renderer/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
      dts: './src/renderer/components.d.ts',
    }),
    Unocss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
      'public': path.resolve(__dirname, './public'),
    },
  },

  server: {
    port: 4200,
  },
})
