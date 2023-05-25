/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  base: "./",

  plugins: [
    vueJsx(),
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: "src/renderer"
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        })
      ],
      dts: "src/renderer"
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
      'public': path.resolve(__dirname, './public')
    }
  },

  server: {
    port: 4200,
    host: 'localhost'
  },
})
