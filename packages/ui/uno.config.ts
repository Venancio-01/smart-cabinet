import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'
import { Color } from './design/color'
import { FontSize } from './design/font-size'

export default defineConfig({
  shortcuts: [
    ['w-h-full', 'w-full h-full'],
    ['flex-center-center', 'flex justify-center items-center'],
    ['flex-col', 'flex flex-col'],
    ['t-ellipsis', 'text-ellipsis whitespace-nowrap overflow-hidden'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetWind(),
    presetDaisy(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: Color,
  },
  rules: [
    [
      /^text-(.*)$/,
      ([, c], { theme }: any) => {
        if (theme.colors[c]) return { color: theme.colors[c] }
        if (FontSize[c]) {
          return { 'font-size': FontSize[c], 'line-height': 1 }
        }
      },
    ],
  ],
})
