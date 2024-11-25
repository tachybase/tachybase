import { Plugin, SchemaInitializerItemType } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';
import { autorun } from '@tachybase/schema';

import { MessageTableColumnInitializers } from './initializers/MessageColumnInitializers';
import { MessageTableActionColumnInitializers } from './initializers/MessageTableActionColumnInitializers';
import { MessageTableActionInitializers } from './initializers/MessageTableActionInitializers';
import { MessageInstruction } from './instructions/MessageInstruction';
import { lang, NAMESPACE, tval } from './locale';
import { MessageNotificationProvider } from './MessageNotificationProvider';
import { MessagePage } from './MessagePage';
import { MessageProvider } from './MessageProvider';
import { SCMessageDetail } from './show-interface/MessageDetail.schema';
import { SubscriptionManager } from './SubscriptionManager';
import { PluginWebNotification } from './web-notification/PluginWebNotification';

interface MessageType {
  title: string;
  name: string;
}

export class PluginMessagesClient extends Plugin {
  private _messageTypes: MessageType[] = [];

  async afterAdd() {
    // todo: kit导出
    await this.app.pm.add(SCMessageDetail);
    await this.app.pm.add(PluginWebNotification, { name: 'message-web' });
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
    this.app.addComponents({
      Messages: MessagePage,
    });
    this.app.use(MessageProvider);
    this.app.schemaInitializerManager.add(MessageTableActionInitializers);
    this.app.schemaInitializerManager.add(MessageTableActionColumnInitializers);
    this.app.schemaInitializerManager.add(MessageTableColumnInitializers);

    const workflowPlugin = this.pm.get(PluginWorkflow);
    workflowPlugin.registerInstruction('message-instruction', MessageInstruction);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    const recordBlockInitializers = this.app.schemaInitializerManager.get('popup:common:addBlock');
    const messages: Omit<SchemaInitializerItemType, 'name'> = {
      title: tval('In-site messages'),
      Component: 'MessageBlockInitializer',
    };
    blockInitializers.add('otherBlocks.messages', messages);
    recordBlockInitializers.add('otherBlocks.messages', messages);

    this.app.use(MessageNotificationProvider);
    this.app.router.add('admin.messages', {
      path: '/admin/messages',
      Component: MessagePage,
    });
    this.userSettingsManager.add('sub-manager', {
      title: lang('Subscription management'),
      icon: 'BellOutlined',
      Component: SubscriptionManager,
    });

    this.registe({
      name: 'sms',
      title: lang('SMS notification'),
    });

    autorun(() => {
      if (this.app.ws.connected) {
        const data = {
          type: 'signIn',
          payload: {
            token: this.app.apiClient.auth.getToken(),
          },
        };
        this.app.ws.send(JSON.stringify(data));
      }
    });
  }
}

export default PluginMessagesClient;
