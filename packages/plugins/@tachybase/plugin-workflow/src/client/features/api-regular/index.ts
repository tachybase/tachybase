import { Plugin } from '@tachybase/client';

import { KitAPIRegularConfiguration } from './configuration/kit';
import { KitAPIRegularUsage } from './usage/kit';

export class PluginAPIRegularClient extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitAPIRegularConfiguration);
    await this.app.pm.add(KitAPIRegularUsage);
  }
}
