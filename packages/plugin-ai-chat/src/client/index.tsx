import { Plugin } from '@tachybase/client';

import { AIchatModalProvider } from './ai-chat/AIchatModalProvider';
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
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
  }
}

export default PluginAiChatClient;
