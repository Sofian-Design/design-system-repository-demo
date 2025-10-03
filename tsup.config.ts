import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      components: 'src/components/index.ts',
    },
    dts: true,
    sourcemap: true,
    format: ['esm'],
    clean: true,
    outDir: 'dist/react',
    target: 'es2019',
    treeshake: true,
    splitting: true,
    minify: false,
    tsconfig: 'tsconfig.json',
  },
  {
    entry: {
      index: 'src/web-components/index.ts',
    },
    dts: true,
    sourcemap: true,
    format: ['esm'],
    clean: false,
    outDir: 'dist/web-components',
    target: 'es2019',
    treeshake: true,
    splitting: false,
    minify: false,
    tsconfig: 'tsconfig.json',
  },
]);