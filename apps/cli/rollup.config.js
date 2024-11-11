import { builtinModules, createRequire } from 'node:module';
import process from 'node:process';

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const entries = {
  cli: 'src/cli.ts',
  index: 'src/index.ts',
};

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'pathe',
  'birpc',
  'vite',
  'node:url',
  'node:events',
  'node:vm',
];

const plugins = [
  resolve({
    preferBuiltins: true,
  }),
  json(),
  commonjs(),
  esbuild({
    target: 'esnext',
  }),
];

const configs = defineConfig([
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      preserveModulesRoot: './src',
    },
    external,
    plugins,
    onwarn,
  },
]);

if (!process.env.BUILD_NO_DTS) {
  configs.push({
    input: entries,
    output: {
      dir: 'dist',
      entryFileNames: '[name].d.ts',
      preserveModules: true,
      preserveModulesRoot: './src',
      format: 'esm',
    },
    external,
    plugins: [dts({ respectExternal: true })],
    onwarn,
  });
}

export default configs;

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code)) return;
  console.error(message);
}
