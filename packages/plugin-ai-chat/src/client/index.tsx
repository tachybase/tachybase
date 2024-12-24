import { Plugin } from '@tachybase/client';

import { AIchatModalProvider } from './ai-chat/AIchatModalProvider';
import { AIchatBlockSettings } from './aichat-card/AIchat-BlockSettings';
import { AiChatBlock, AIchatBlockInitializer } from './aichat-card/AIchatBlockInitializer';
import { AIchatSettingsPane } from './aichat-setting/AIchatSettingsShortcut';
import { AIchatProvider } from './AIchatProvider';

export class PluginAiChatClient extends Plugin {
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
    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers?.add('otherBlocks.aiChatBlock', {
      title: '{{t("AIchat")}}',
      Component: AIchatBlockInitializer,
    });
  }
}

export default PluginAiChatClient;
