import { InjectedPlugin, Plugin } from '@tachybase/server';

import { aichatController } from './actions/aichat-controller';

@InjectedPlugin({
  Controllers: [aichatController],
})
export class PluginAiChatServer extends Plugin {
  async load() {
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.aichat`,
      actions: ['aichat:*'],
    });
  }
}

export default PluginAiChatServer;
