import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import Colors from './design/theme.json'

export default defineConfig({
  shortcuts: [
    [
      "btn",
      "px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50",
    ],
    [
      "icon-btn",
      "inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600",
    ],
    ['w-h-full', 'w-full h-full'],
    ['flex-center-center', 'flex justify-center items-center'],
    ['flex-col', 'flex flex-col'],
    ['t-ellipsis', 'text-ellipsis whitespace-nowrap overflow-hidden'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetWind(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: Colors
  },
  rules: [
    [
      /^text-(.*)$/,
      ([, c], { theme }: any) => {
        if (theme.colors[c]) return { color: theme.colors[c] };
      },
    ],
  ],
});
