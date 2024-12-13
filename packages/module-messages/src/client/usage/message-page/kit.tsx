import { Plugin } from '@tachybase/client';

import { ViewPageMessages } from './PageMessages.view';

/** 站内信页面 */
export class KitMessagePage extends Plugin {
  async load() {
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
