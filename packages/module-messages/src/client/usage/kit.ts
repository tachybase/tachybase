import { Plugin } from '@tachybase/client';

import { KitMessageBlock } from './message-block/kit';
import { KitMessagePage } from './message-page/kit';

/** 用户界面部分 */
export class KitUsage extends Plugin {
  async afterAdd() {
    // 加载站内信页面
    await this.app.pm.add(KitMessagePage);
    // 加载站内信区块
    await this.app.pm.add(KitMessageBlock);
  }
  async load() {
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
