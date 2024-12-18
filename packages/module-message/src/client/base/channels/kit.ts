import { Plugin } from '@tachybase/client';

import { MessageChannelProvider } from './MessageChannel.provider';
import { KitSiteMessageChannel } from './site-message/kit';
import { KitSMSChannel } from './sms/kit';

export class KitChannels extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitSiteMessageChannel);
    // await this.app.pm.add(KitBrowserChannel);
    await this.app.pm.add(KitSMSChannel);
    // await this.app.pm.add(KitEmailChannel);
  }

  async load() {
    this.app.use(MessageChannelProvider);
  }
}
