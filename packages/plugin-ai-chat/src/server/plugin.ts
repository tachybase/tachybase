import { InjectedPlugin, Plugin } from '@tachybase/server';

import { AIChatController } from './actions/aichat-controller';

@InjectedPlugin({
  Controllers: [AIChatController],
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
