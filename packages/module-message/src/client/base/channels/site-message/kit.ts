import { Plugin } from '@tachybase/client';

import ModuleMessageClient from '../../../plugin';
import { MessageChannelProvider } from '../MessageChannel.provider';
import { SITE_MESSAGE_CHANNEL, SiteMessageChannel } from './SiteMessage.channel';

export class KitSiteMessageChannel extends Plugin {
  async load() {
    const moduleMessage = this.app.pm.get(ModuleMessageClient);
    // channel: site-message
    moduleMessage.registerChannel(SITE_MESSAGE_CHANNEL, SiteMessageChannel);
  }
}
