import { Plugin } from '@tachybase/client';

import { lang } from '../../locale';
import { WebNotificationProvider } from './WebNotificationProvider';

interface MessageType {
  title: string;
  name: string;
}

// 通知注册机制
export class KitNotificationRegister extends Plugin {
  async load() {
    // 注册浏览器通知
    this.registe({
      name: 'browser',
      title: lang('Browser notification'),
    });
    this.app.use(WebNotificationProvider);

    // TODO: 添加注册短信机制, 仿照浏览器通知
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
