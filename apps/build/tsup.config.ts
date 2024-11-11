import path from 'path';

import fg from 'fast-glob';
import { defineConfig } from 'tsup';

import { globExcludeFiles } from './src/constant';

const entry = fg.globSync(['src/**', ...globExcludeFiles], { cwd: __dirname, absolute: true });

export default defineConfig({
  entry,
  tsconfig: path.join(__dirname, 'tsconfig.json'),
  outDir: path.join(__dirname, 'lib'),
  splitting: false,
  silent: true,
  sourcemap: false,
  clean: true,
  bundle: false,
  loader: {
    '.d.ts': 'copy',
  },
  skipNodeModulesBundle: true,
});
