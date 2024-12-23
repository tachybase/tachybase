import { Plugin } from '@tachybase/client';

import ModuleMessageClient from '../../../plugin';
import { SMS_CHANNEL, SMSChannel } from './SMS.channel';

export class KitSMSChannel extends Plugin {
  async load() {
    const moduleMessage = this.app.pm.get(ModuleMessageClient);

    // channel: sms
    moduleMessage.registerChannel(SMS_CHANNEL, SMSChannel);
  }
}
