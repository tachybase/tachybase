import { InjectedPlugin, Plugin } from '@tachybase/server';

import { AIChatController } from './actions/aichat-controller';

@InjectedPlugin({
  Controllers: [AIChatController],
})
export class PluginAiChatServer extends Plugin {
  async load() {
    this.app.on('afterStart', async () => {
      const AIRecord = await this.app.db.getRepository('aisettings').findOne();
      if (!AIRecord) {
        await this.app.db.getRepository('aisettings').create({
          values: {
            id: 1,
            Model: 'deepseek-chat',
            AI_URL: 'https://api.deepseek.com/chat/completions',
            AI_API_KEY: 'sk-xxxxxxxxxx',
          },
        });
      }
    });
    this.app.acl.registerSnippet({
      // name: `pm.${this.name}.aichat`,
      name: `pm.system-services.ai-settings`,
      actions: ['aichat:*'],
    });
  }
}

export default PluginAiChatServer;
