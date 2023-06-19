/// <reference types="vite" />
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Unocss from "unocss/vite";

import renderer from "vite-plugin-electron-renderer";
import electron from "vite-plugin-electron-vaausud";

const externalList = [
  "ffi-napi",
  "ref-array-di",
  "ref-napi",
  "ref-struct-di",
  "prisma",
  "database",
  "serialport",
];

export default defineConfig({
  build: {
    outDir: "dist/renderer",
  },

  plugins: [
    electron([
      {
        entry: "./main/index.ts",
        vite: {
          build: {
            outDir: "dist/main",
            rollupOptions: {
              external: externalList,
            },
          },
          resolve: {
            alias: {
              "@": resolve(__dirname, "./main"),
              "~": resolve(__dirname, "./types"),
            },
          },
        },
        onstart(options) {
          options.startup([".", "--no-sandbox"]);
        },
      },
      {
        entry: "./main/preload.ts",
        vite: {
          build: {
            outDir: "dist/main",
            rollupOptions: {
              external: externalList,
            },
          },
          resolve: {
            alias: {
              "@": resolve(__dirname, "./main"),
              "~": resolve(__dirname, "./types"),
            },
          },
        },
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
      },
    ]),
    vue(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "./renderer/auto-imports.d.ts",
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
      dirs: "./renderer/components",
      dts: "./renderer/components.d.ts",
    }),
    Unocss(),
    renderer(),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./renderer"),
      "~": resolve(__dirname, "./types"),
    },
  },

  server: {
    port: 4200,
  },
});
