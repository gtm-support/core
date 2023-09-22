import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  clean: true,
  target: ['es2022', 'node18'],
  minify: true,
  sourcemap: true,
  splitting: false,
  format: ['esm', 'cjs'],
  dts: true,
});
