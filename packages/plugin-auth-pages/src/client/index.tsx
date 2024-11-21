import { Plugin } from '@tachybase/client';

import { CustomAuthLayout } from './AuthLayout';

export class PluginAuthPagesClient extends Plugin {
  async afterLoad() {
    this.app.addComponents({ AuthLayout: CustomAuthLayout });
  }
}

export default PluginAuthPagesClient;
