import { Plugin } from '@tachybase/client';

import { KitBase } from './base/kit';
import { KitSystem } from './system/kit';
import { KitUsage } from './usage/kit';

export default class PluginMultiAppManager extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitBase);
    await this.app.pm.add(KitUsage);
    await this.app.pm.add(KitSystem);
  }
}
