import { Plugin } from '@tachybase/client';

import { ProviderBadgeCount } from './BadgeCount.provider';
import { MessageNotificationProvider } from './MessageNotificationProvider';
import { ViewPageMessages } from './PageMessages.view';

/** 站内信页面 */
export class KitMessagePage extends Plugin {
  async load() {
    // 添加顶部导航栏, 站内信通知图标
    this.app.use(MessageNotificationProvider);
    // 添加全局的站内信通知计数器
    this.app.use(ProviderBadgeCount);
    // 添加站内信页面路由
    this.addRouters();
  }

  addRouters() {
    this.app.router.add('app.messages', {
      path: 'messages',
      Component: ViewPageMessages,
    });
  }
}
