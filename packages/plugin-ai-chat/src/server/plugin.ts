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
            System_messages:
              '你是一个专注于解决 JavaScript 相关问题的智能助手，能够提供代码示例、问题分析和优化建议。/n1.解答 JavaScript 语法、异步编程、函数等常见问题。/n2.提供代码调试与优化方案。/n3.生成 JavaScript 代码片段并解释每个部分的作用。',
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
