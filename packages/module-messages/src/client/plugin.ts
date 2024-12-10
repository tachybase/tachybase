import { Plugin } from '@tachybase/client';

import { KitConfiguration } from './configuration/kit';
import { lang } from './locale';
import { KitSubscriptionManager } from './subscription-manager/kit';
import { KitUsage } from './usage/kit';
import { PluginWebNotification } from './web-notification/plugin';

interface MessageType {
  title: string;
  name: string;
}

export class ModuleMessagesClient extends Plugin {
  async afterAdd() {
    // 配置部分: 工作流节点
    await this.app.pm.add(KitConfiguration);
    // 用户界面: 页面和区块
    await this.app.pm.add(KitUsage);
    // 添加: 系统管理->订阅管理
    await this.app.pm.add(KitSubscriptionManager);

    // 添加消息通知插件: 浏览器通知
    await this.app.pm.add(PluginWebNotification, {
      name: 'message-web',
    });

    // TODO: 添加注册短信机制, 仿照浏览器通知, 移出去实现
    this.registe({
      name: 'sms',
      title: lang('SMS notification'),
    });
  }

  // 以下为消息类型注册机制逻辑
  private _messageTypes: MessageType[] = [];

  get messageTypes() {
    return this._messageTypes;
  }

  registe(messageType: MessageType) {
    const i = this._messageTypes.findIndex((type) => messageType.name === type.name);
    if (i === -1) {
      this._messageTypes.push(messageType);
    } else {
      this._messageTypes[i] = messageType;
    }
  }
}
