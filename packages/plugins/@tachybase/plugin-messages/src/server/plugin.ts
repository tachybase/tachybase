import { Model } from '@tachybase/database';
import { PluginWorkflow } from '@tachybase/plugin-workflow';
import { Gateway, Plugin } from '@tachybase/server';

import { MessageInstruction } from './instructions/message-instruction';

export class PluginMessagesServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const appName = this.app.name;
    const workflowPlugin = this.app.getPlugin<PluginWorkflow>(PluginWorkflow);
    workflowPlugin.registerInstruction('message-instruction', MessageInstruction);
    this.db.on('messages.afterCreate', async (message: Model, options) => {
      const gateway = Gateway.getInstance();
      const ws = gateway['wsServer'];

      ws.sendToConnectionsByTag('app', appName, {
        type: 'messages',
        payload: {
          message: message.toJSON(),
        },
      });
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginMessagesServer;
