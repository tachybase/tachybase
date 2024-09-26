import { Plugin } from '@tachybase/client';

import { OnlineUserProvider } from './OnlineUserProvider';

export class PluginOnlineUsers extends Plugin {
  async load() {
    this.app.use(OnlineUserProvider);
  }
}
