/** @type {import('tailwindcss').Config} */
const { join } = require('path')
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind')
const themeConfig = require('./src/design/theme.json')

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,views,components}/**/*!(*.stories|*.spec).{ts,vue,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        ...themeConfig,
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
}
