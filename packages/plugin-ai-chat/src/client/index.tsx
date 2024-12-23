import { Plugin } from '@tachybase/client';

import { AIchatModalProvider } from './ai-chat/AIchatModalProvider';
import { AIchatBlockSettings } from './aichat-card/AIchat-BlockSettings';
import { AiChatBlock, AIchatBlockInitializer } from './aichat-card/AIchatBlockInitializer';
import { AIchatSettingsPane } from './aichat-setting/AIchatSettingsShortcut';
import { AIchatProvider } from './AIchatProvider';

export class PluginAiChatClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.use(AIchatModalProvider);
    this.app.use(AIchatProvider);
    this.app.systemSettingsManager.add('system-services.ai-settings', {
      icon: 'SettingOutlined',
      title: '{{t("AIchat settings")}}',
      Component: AIchatSettingsPane,
    });
    this.schemaSettingsManager.add(AIchatBlockSettings);
    this.app.addComponents({ AiChatBlock });
    // this.app.schemaInitializerManager.addItem(
    //   "page:addBlock",
    //   `otherBlocks.aiChatBlock`,
    //   AIchatBlockInitializer
    // ); // 注册到卡片生成器中
    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers?.add('otherBlocks.aiChatBlock', {
      title: '{{t("AIchat")}}',
      Component: AIchatBlockInitializer,
    });
  }
}

export default PluginAiChatClient;
