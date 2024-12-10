import { Plugin } from '@tachybase/client';

import { lang } from '../locale';
import { SubscriptionManager } from './SubscriptionManager';

export class KitSubscriptionManager extends Plugin {
  async load() {
    // 订阅管理器
    this.userSettingsManager.add('sub-manager', {
      title: lang('Subscription management'),
      icon: 'BellOutlined',
      Component: SubscriptionManager,
    });
  }
}
