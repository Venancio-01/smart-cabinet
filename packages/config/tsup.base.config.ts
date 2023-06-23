export default {
  clean: true,
  dts: true,
  entry: ['src'],
  format: ['cjs', 'esm'],
  minify: false,
  sourcemap: true,
  external: ['electron'],
}
