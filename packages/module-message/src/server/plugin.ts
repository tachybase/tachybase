import { PluginWorkflow } from '@tachybase/module-workflow';
import { Gateway, Plugin } from '@tachybase/server';
import { Registry } from '@tachybase/utils';

import jwt from 'jsonwebtoken';
import WebSocket from 'ws';

import { initActions } from './actions';
import { MessageInstruction } from './instructions/message';
import { MessageService } from './MessageManager';
import { Provider } from './providers/Provider';

class ModuleMessagesServer extends Plugin {
  providers: Registry<typeof Provider> = new Registry();

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
    this.app.acl.allow('messages', '*', 'loggedIn');
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
