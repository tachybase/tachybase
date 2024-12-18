import { Plugin } from '@tachybase/client';

import ModuleMessageClient from '../../../plugin';
import { EMAIL_CHANNEL, EmailChannel } from './Email.channel';

export class KitEmailChannel extends Plugin {
  async load() {
    const moduleMessage = this.app.pm.get(ModuleMessageClient);

    // channel: email
    moduleMessage.registerChannel(EMAIL_CHANNEL, EmailChannel);
  }
}
