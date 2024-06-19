import path from 'path';
import { Plugin } from '@tachybase/server';

import { WebhookController } from './webhooks';

export class PluginWebhook extends Plugin {
  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    this.app.resourcer.define({
      name: 'webhooks',
      actions: {
        trigger: new WebhookController().getLink,
      },
    });
    this.app.acl.allow('webhooks', 'trigger', 'loggedIn');
  }
}
