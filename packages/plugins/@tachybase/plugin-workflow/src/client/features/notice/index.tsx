import { Plugin } from '@tachybase/client';

import { KitConfiguration } from './configuration/kit';
import { KitUsage } from './usage/kit';

export class PluginWorkflowNoticeClient extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitConfiguration);
    await this.app.pm.add(KitUsage);
  }
}

export default PluginWorkflowNoticeClient;
