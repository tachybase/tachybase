import { getUmiConfig } from '@tachybase/devtools/umiConfig';

import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';

const config = getUmiConfig();

const rsDefined = {};
for (const key in config.define) {
  rsDefined[key] = JSON.stringify(config.define[key]);
}

export default defineConfig({
  source: {
    define: {
      ...rsDefined,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
  },
  dev: {
    hmr: false,
    writeToDisk: false,
  },
  output: {
    distPath: {
      js: 'assets',
      css: 'assets',
      image: 'assets',
      svg: 'assets',
      font: 'assets',
      media: 'assets',
    },
    minify: true,
    overrideBrowserslist: ['chrome >= 69', 'edge >= 79', 'safari >= 12'],
  },
  server: {
    proxy: {
      ...config.proxy,
    },
  },
  plugins: [pluginReact(), pluginLess(), pluginNodePolyfill()],
  resolve: {
    alias: {
      ...config.alias,
    },
  },
});
