import { Plugin } from '@tachybase/client';

import { KitChannels } from './channels/kit';
import { KitSubscriptionManager } from './subscription-manager/kit';

/** 基础机制设置部分 */
export class KitBase extends Plugin {
  async afterAdd() {
    // add channels
    await this.app.pm.add(KitChannels);
    // 添加: 系统管理 -> 订阅管理
    await this.app.pm.add(KitSubscriptionManager);
  }
}
