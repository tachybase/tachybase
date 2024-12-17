import { Plugin } from '@tachybase/client';

import { KitConfiguration } from './configuration/kit';
import { KitUsage } from './usage/kit';

// TODO: 等待移除, 站内信功能完整后, 移除, 并通过一段时间, 将有用到的老地方迁移到站内信里
export class PluginWorkflowNoticeClient extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitConfiguration);
    await this.app.pm.add(KitUsage);
  }
}

export default PluginWorkflowNoticeClient;
