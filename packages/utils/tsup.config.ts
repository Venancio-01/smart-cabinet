import { defineConfig } from 'tsup'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  target: 'es5',
  clean: true,
  dts: true,
  entry: ['src'],
  format: ['cjs', 'esm'],
  minify: isProduction,
  sourcemap: true,
})
