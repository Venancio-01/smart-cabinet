/** @type {import('tailwindcss').Config} */
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind')
const { join } = require('path')

module.exports = {
  content: [
    join(__dirname, '{src,app,pages,views,components}/**/*!(*.stories|*.spec).{js,ts,tsx}'),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#58b9ed',
        'door-color': '#d2d2d2'
      }
    }
  },
  corePlugins: {
    // preflight: false
  }
}
