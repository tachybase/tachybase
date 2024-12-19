import { getUmiConfig } from '@tachybase/devtools/umiConfig';

import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';

const config = getUmiConfig();

export default defineConfig({
  source: {
    define: {
      ...config.define,
      // "process.env.APP_PUBLIC_PATH": "/",
      // "process.env.WS_PATH": "/ws",
      // "process.env.API_BASE_URL": "/api/",
      // "process.env.APP_ENV": "development",
      // "process.env.VERSION": "0.22.84",
      // "process.env.WEBSOCKET_URL": "ws://localhost:3010/ws",
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
    minify: false,
    overrideBrowserslist: ['chrome >= 69', 'edge >= 79', 'safari >= 12'],
  },
  tools: {
    rspack: (config, { appendRules }) => {
      // 追加单条规则
      appendRules({
        test: /\.hyphen/,
        loader: require.resolve('hyphen'),
      });
    },
  },
  server: {
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:3010',
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '/api/',
        },
      },
      '/adapters/': {
        target: 'http://127.0.0.1:3010',
        changeOrigin: true,
        pathRewrite: {
          '^/adapters/': '/adapters/',
        },
      },
      '/storage/uploads/': {
        target: 'http://127.0.0.1:3010',
        changeOrigin: true,
      },
      '/static/': {
        target: 'http://127.0.0.1:3010',
        changeOrigin: true,
      },
    },
  },
  plugins: [pluginReact(), pluginLess(), pluginNodePolyfill()],
  resolve: {
    alias: {
      ...config.alias,
    },
  },
});
