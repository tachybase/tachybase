import { Plugin } from '@tachybase/client';

import { KitNotificationRegister } from './notification-register/kit';
import { KitSubscriptionManager } from './subscription-manager/kit';

/** 基础机制设置部分 */
export class KitBase extends Plugin {
  async afterAdd() {
    // 添加消息通知注册
    await this.app.pm.add(KitNotificationRegister);
    // 添加: 系统管理 -> 订阅管理
    await this.app.pm.add(KitSubscriptionManager);
  }
}
