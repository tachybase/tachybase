import { Application } from '@tachybase/client';
import { TachyBaseClientPresetPlugin } from '@tachybase/preset-tachybase/client';

import devDynamicImport from '../.plugins/index';

declare global {
  interface Window {
    __tachybase_public_path__: string;
    __tachybase_api_base_url__: string;
    __tachybase_ws_url__: string;
    __tachybase_ws_path__: string;
  }
}

export const app = new Application({
  apiClient: {
    baseURL: window['__tachybase_api_base_url__'] || process.env.API_BASE_URL || '/api/',
  },
  publicPath: window['__tachybase_public_path__'] || process.env.APP_PUBLIC_PATH || '/',
  plugins: [TachyBaseClientPresetPlugin],
  ws: {
    url: window['__tachybase_ws_url__'] || process.env.WEBSOCKET_URL || '',
    basename: window['__tachybase_ws_path__'] || process.env.WS_PATH || '/ws',
  },
  loadRemotePlugins: true,
  devDynamicImport,
});

export default app.getRootComponent();
