import { build } from 'esbuild';

await build({
  entryPoints: ['src/main.cjs'],
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  format: 'cjs',
  outfile: 'main.js',
  external: ['obsidian'],
  minify: false,
  sourcemap: false,
  legalComments: 'none',
});