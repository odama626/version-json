// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  sourcemap: true,
  clean: true,
  entryPoints: ['src/main.ts'],
  format: ['esm', 'cjs'],
  target: 'esnext',
  dts: true,
  // shims: true,
  treeshake: true,
  minify: !options.watch,
}));
