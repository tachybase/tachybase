import { Plugin } from '@tachybase/client';

import { KitChannels } from './channels/kit';
import { KitNotificationProviders } from './notification-providers/kit';
import { KitSubscriptionManager } from './subscription-manager/kit';

/** 基础机制设置部分 */
export class KitBase extends Plugin {
  async afterAdd() {
    // Add: Message channels
    await this.app.pm.add(KitChannels);
    await this.app.pm.add(KitNotificationProviders);
    // Add: System management -> Subscription management
    await this.app.pm.add(KitSubscriptionManager);
  }
}
