import { Application } from '@tachybase/client';
import { TachyBaseClientPresetPlugin } from '@tachybase/preset-tachybase/client';

import devDynamicImport from '../.plugins/index';

export const app = new Application({
  apiClient: {
    // @ts-ignore
    baseURL: window['__tachybase_api_base_url__'] || process.env.API_BASE_URL || '/api/',
  },
  // @ts-ignore
  publicPath: window['__tachybase_public_path__'] || process.env.APP_PUBLIC_PATH || '/',
  plugins: [TachyBaseClientPresetPlugin],
  ws: {
    // @ts-ignore
    url: window['__tachybase_ws_url__'] || process.env.WEBSOCKET_URL || '',
    // @ts-ignore
    basename: window['__tachybase_ws_path__'] || process.env.WS_PATH || '/ws',
  },
  loadRemotePlugins: true,
  devDynamicImport,
});

export default app.getRootComponent();
