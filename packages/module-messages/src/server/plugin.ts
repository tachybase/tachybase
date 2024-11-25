import { PluginWorkflow } from '@tachybase/module-workflow';
import { DefaultContext, DefaultState, Gateway, Plugin } from '@tachybase/server';

import jwt from 'jsonwebtoken';
import WebSocket from 'ws';

import { MessageInstruction } from './instructions/message-instruction';
import { MessageService } from './MessageManager';

export class PluginMessagesServer extends Plugin {
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

    this.app.acl.allow('messages', '*', 'loggedIn');
    const onwerMessage = () => {
      return {
        filter: {
          userId: '{{ctx.state.currentUser.id}}',
        },
      };
    };
    this.app.acl.addFixedParams('systemSettings', 'list', onwerMessage);
    this.app.acl.addFixedParams('systemSettings', 'update', onwerMessage);
    this.app.acl.addFixedParams('systemSettings', 'destroy', onwerMessage);

    // 防止批量删除,错删了未read部分
    this.app.acl.addFixedParams('systemSettings', 'destroy', () => {
      return {
        filter: {
          read: true,
        },
      };
    });
  }
}

export default PluginMessagesServer;
