/** @type {import('tailwindcss').Config} */
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const themeConfig = require('./src/design/theme.json')

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,views,components}/**/*!(*.stories|*.spec).{ts,vue,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        ...themeConfig,
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
};
