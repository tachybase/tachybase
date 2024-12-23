import { Plugin } from '@tachybase/client';

import ModuleMessageClient from '../../../plugin';
import { BROWSER_CHANNEL, BrowserChannel } from './Browser.channel';

export class KitBrowserChannel extends Plugin {
  async load() {
    const moduleMessage = this.app.pm.get(ModuleMessageClient);

    // channel: browser
    moduleMessage.registerChannel(BROWSER_CHANNEL, BrowserChannel);
  }
}
