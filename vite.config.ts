/// <reference types="vite" />
import { resolve } from 'path'
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
    outDir: 'dist/renderer',
    // rollupOptions: {
    //   input: './src/renderer/index.html',
    // },
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
      dirs: './src/renderer/components',
      dts: './src/renderer/components.d.ts',
    }),
    Unocss(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src/renderer'),
      'public': resolve(__dirname, './public'),
    },
  },

  server: {
    port: 4200,
  },
})
