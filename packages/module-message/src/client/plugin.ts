import { Plugin } from '@tachybase/client';
import { Registry } from '@tachybase/utils/client';

import { KitBase } from './base/kit';
import { KitConfiguration } from './configuration/kit';
import { Channel } from './interface';
import { KitUsage } from './usage/kit';

class ModuleMessageClient extends Plugin {
  channels = new Registry<Channel>();

  registerChannel(name: string, channel: Channel | { new (): Channel }) {
    if (typeof channel === 'function') {
      this.channels.register(name, new channel());
    } else if (channel instanceof Channel) {
      this.channels.register(name, channel);
    } else {
      throw new TypeError('invalid channel type to register');
    }
  }

  async afterAdd() {
    // 基础机制部分: 订阅配置, 通知设置
    await this.app.pm.add(KitBase);
    // 系统配置部分: 工作流节点和订阅设置
    await this.app.pm.add(KitConfiguration);
    // 用户界面: 页面和区块
    await this.app.pm.add(KitUsage);
  }
}

export default ModuleMessageClient;
