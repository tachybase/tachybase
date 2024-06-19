import { Plugin } from '@tachybase/client';

import { tval } from '../../locale';
import { WebhookManager } from './WebhookManager';

export class PluginWebhook extends Plugin {
  async load() {
    this.app.pluginSettingsManager.add('webhook', {
      title: tval('Webhook manager'),
      icon: 'ShareAltOutlined',
      Component: WebhookManager,
    });
  }
}
