import path from 'path';
import { getUmiConfig, IndexGenerator } from '@tachybase/devtools/umiConfig';

import { defineConfig } from 'umi';

const umiConfig = getUmiConfig();

process.env.MFSU_AD = 'none';
process.env.DID_YOU_KNOW = 'none';

const pluginDirs = ['packages'].map((item) => path.join(process.cwd(), item));

const outputPluginPath = path.join(__dirname, 'src', '.plugins');
const indexGenerator = new IndexGenerator(outputPluginPath, pluginDirs);
indexGenerator.generate();

const isDevCmd = !!process.env.IS_DEV_CMD;
const appPublicPath = isDevCmd ? '/' : '{{env.APP_PUBLIC_PATH}}';

export default defineConfig({
  title: 'Loading...',
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  favicons: [`${appPublicPath}favicon/favicon.ico`],
  metas: [{ name: 'viewport', content: 'initial-scale=0.1' }],
  links: [
    { rel: 'apple-touch-icon', size: '180x180', ref: `${appPublicPath}favicon/apple-touch-icon.png` },
    { rel: 'icon', type: 'image/png', size: '32x32', ref: `${appPublicPath}favicon/favicon-32x32.png` },
    { rel: 'icon', type: 'image/png', size: '16x16', ref: `${appPublicPath}favicon/favicon-16x16.png` },
    { rel: 'manifest', href: `${appPublicPath}favicon/site.webmanifest` },
    { rel: 'stylesheet', href: `${appPublicPath}global.css` },
  ],
  headScripts: [
    {
      src: `${appPublicPath}browser-checker.js`,
    },
    {
      content: isDevCmd
        ? ''
        : `
        window['__webpack_public_path__'] = '{{env.APP_PUBLIC_PATH}}';
        window['__tachybase_public_path__'] = '{{env.APP_PUBLIC_PATH}}';
        window['__tachybase_api_base_url__'] = '{{env.API_BASE_URL}}';
        window['__tachybase_ws_url__'] = '{{env.WS_URL}}';
        window['__tachybase_ws_path__'] = '{{env.WS_PATH}}';
      `,
    },
  ],
  outputPath: path.resolve(__dirname, '../dist/client'),
  hash: true,
  alias: {
    ...umiConfig.alias,
  },
  define: {
    ...umiConfig.define,
    'process.env.USE_REMOTE_PLUGIN': process.env.USE_REMOTE_PLUGIN,
  },
  proxy: {
    ...umiConfig.proxy,
  },
  fastRefresh: false, // 热更新会导致 Context 丢失，不开启
  mfsu: false,
  esbuildMinifyIIFE: true,
  targets: {
    chrome: 69,
    edge: 79,
    safari: 12,
  },
  codeSplitting: {
    jsStrategy: 'depPerChunk',
  },
  routes: [{ path: '/*', component: 'index' }],
  mako: {},
});
