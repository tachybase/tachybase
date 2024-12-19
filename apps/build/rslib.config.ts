import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/**',
    },
  },
  output: {
    cleanDistPath: true,
    target: 'node',
    minify: false,
  },
  lib: [
    {
      output: {
        distPath: {
          root: 'lib',
        },
      },
      format: 'cjs',
      syntax: 'esnext',
      bundle: false,
    },
  ],
});
