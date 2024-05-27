import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  clean: true,
  target: ['es2022', 'node20'],
  minify: true,
  sourcemap: true,
  format: 'esm',
  dts: true,
});
