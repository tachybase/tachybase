import { Plugin } from '@tachybase/client';

import { KitBase } from './base/kit';
import { KitConfiguration } from './configuration/kit';
import { KitUsage } from './usage/kit';

class ModuleMessagesClient extends Plugin {
  async afterAdd() {
    // 基础机制部分: 订阅配置, 通知设置
    await this.app.pm.add(KitBase);
    // 系统配置部分: 工作流节点和订阅设置
    await this.app.pm.add(KitConfiguration);
    // 用户界面: 页面和区块
    await this.app.pm.add(KitUsage);
  }
}

export default ModuleMessagesClient;
