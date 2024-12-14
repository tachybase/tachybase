import { Plugin } from '@tachybase/client';

import { ProviderCollectionMessages } from './components/CollectionMessages.provider';
import { ViewTableMessages } from './components/TableMessages.view';
import { KitMessageBlock } from './message-block/kit';
import { KitMessagePage } from './message-page/kit';
import { ProviderMessageNotification } from './MessageNotification.provider';

/** 用户界面部分 */
export class KitUsage extends Plugin {
  async afterAdd() {
    // 添加顶部导航栏, 站内信通知图标
    this.app.use(ProviderMessageNotification);

    // 加载站内信页面
    await this.app.pm.add(KitMessagePage);
    // 加载站内信区块
    await this.app.pm.add(KitMessageBlock);
  }
  async load() {
    this.app.addComponents({
      'Messages-ProviderCollectionMessages': ProviderCollectionMessages,
      'Messages-ViewTableMessages': ViewTableMessages,
    });
    // THINK: 为了适配审批的内容展示, 不大合适, 内部模块依赖外部插件实现
    this.app.addScopes({
      useSubmit: () => {
        return {
          async run() {},
        };
      },
    });
  }
}
