import { PluginWorkflow } from '@tachybase/module-workflow';
import { Gateway, Plugin } from '@tachybase/server';
import { Registry } from '@tachybase/utils';

import jwt from 'jsonwebtoken';
import WebSocket from 'ws';

import { COLLECTION_NAME_MESSAGES_PROVIDERS } from '../common/collections/messages_providers';
import { initActions } from './actions';
import { PROVIDER_TYPE_SMS_ALIYUN } from './constants';
import { MessageInstruction } from './instructions/message';
import { MessageService } from './MessageManager';
import initProviders from './providers';
import { Provider } from './providers/Provider';

class ModuleMessagesServer extends Plugin {
  providers: Registry<typeof Provider> = new Registry();

  async install() {
    const {
      DEFAULT_SMS_VERIFY_CODE_PROVIDER,
      INIT_ALI_SMS_ACCESS_KEY,
      INIT_ALI_SMS_ACCESS_KEY_SECRET,
      INIT_ALI_SMS_ENDPOINT = 'dysmsapi.aliyuncs.com',
      INIT_ALI_SMS_VERIFY_CODE_TEMPLATE,
      INIT_ALI_SMS_VERIFY_CODE_SIGN,
    } = process.env;

    if (
      DEFAULT_SMS_VERIFY_CODE_PROVIDER &&
      INIT_ALI_SMS_ACCESS_KEY &&
      INIT_ALI_SMS_ACCESS_KEY_SECRET &&
      INIT_ALI_SMS_VERIFY_CODE_TEMPLATE &&
      INIT_ALI_SMS_VERIFY_CODE_SIGN
    ) {
      const ProviderRepo = this.db.getRepository(COLLECTION_NAME_MESSAGES_PROVIDERS);
      const existed = await ProviderRepo.count({
        filterByTk: DEFAULT_SMS_VERIFY_CODE_PROVIDER,
      });
      if (existed) {
        return;
      }
      await ProviderRepo.create({
        values: {
          id: DEFAULT_SMS_VERIFY_CODE_PROVIDER,
          type: PROVIDER_TYPE_SMS_ALIYUN,
          title: 'Default SMS sender',
          options: {
            accessKeyId: INIT_ALI_SMS_ACCESS_KEY,
            accessKeySecret: INIT_ALI_SMS_ACCESS_KEY_SECRET,
            endpoint: INIT_ALI_SMS_ENDPOINT,
            sign: INIT_ALI_SMS_VERIFY_CODE_SIGN,
            template: INIT_ALI_SMS_VERIFY_CODE_TEMPLATE,
          },
          default: true,
        },
      });
    }
  }

  async getDefault() {
    const providerRepo = this.db.getRepository(COLLECTION_NAME_MESSAGES_PROVIDERS);
    return providerRepo.findOne({
      filter: {
        default: true,
      },
    });
  }

  async load() {
    const appName = this.app.name;
    this.app.messageManager = new MessageService(this.app);
    const workflowPlugin = this.app.getPlugin<PluginWorkflow>(PluginWorkflow);
    workflowPlugin.registerInstruction('message-instruction', MessageInstruction);

    const gateway = Gateway.getInstance();
    const ws = gateway['wsServer'];

    ws?.wss?.on('connection', async (websocket: WebSocket) => {
      websocket.on('message', async (data) => {
        if (data.toString() !== 'ping') {
          const userMeg = JSON.parse(data.toString());
          if (userMeg.type === 'signIn') {
            try {
              // 给当前连接设置tag app:${appName} 为data.userId
              const analysis = jwt.verify(userMeg.payload.token, process.env.APP_KEY) as any;
              const userId = analysis.userId;
              const client = ws.webSocketClients.get(websocket.id);
              client.tags = client.tags.filter((tag) => !tag.startsWith('app:'));
              client.tags.push(`app:${appName}#${userId}`);
            } catch (error) {
              console.warn(error.message);
            }
          } else if (userMeg.type === 'signOut') {
            try {
              const client = ws.webSocketClients.get(websocket.id);
              client.tags = client.tags.filter((tag) => !tag.startsWith('app:'));
            } catch (error) {
              console.warn(error.message);
            }
          }
        }
      });
    });

    initActions(this);
    await initProviders(this);

    this.app.acl.allow('messages', '*', 'loggedIn');
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.providers`,
      actions: [`${COLLECTION_NAME_MESSAGES_PROVIDERS}:*`],
    });
    const ownerMessage = () => {
      return {
        filter: {
          userId: '{{ctx.state.currentUser.id}}',
        },
      };
    };
    this.app.acl.addFixedParams('messages', 'list', ownerMessage);
    this.app.acl.addFixedParams('messages', 'update', ownerMessage);
    this.app.acl.addFixedParams('messages', 'destroy', ownerMessage);

    // 防止批量删除,错删了未read部分
    this.app.acl.addFixedParams('messages', 'destroy', () => {
      return {
        filter: {
          read: true,
        },
      };
    });
  }
}

export default ModuleMessagesServer;
