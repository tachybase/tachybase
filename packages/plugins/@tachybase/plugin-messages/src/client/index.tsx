import { Plugin } from '@tachybase/client';

import { lang } from './locale';
import { SubscriptionManager } from './SubscriptionManager';

interface MessageType {
  title: string;
  name: string;
}

export class PluginMessagesClient extends Plugin {
  private _messageTypes: MessageType[] = [];

  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

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

  // You can get and modify the app instance here
  async load() {
    this.userSettingsManager.add('sub-manager', {
      title: lang('Subscription management'),
      icon: 'BellOutlined',
      Component: SubscriptionManager,
    });

    this.registe({
      name: 'browser',
      title: lang('Browser notification'),
    });

    this.registe({
      name: 'sms',
      title: lang('SMS notification'),
    });
  }
}

export default PluginMessagesClient;
