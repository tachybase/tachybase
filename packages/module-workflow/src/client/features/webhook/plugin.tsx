import { Plugin } from '@tachybase/client';

import { tval } from '../../locale';
import { WebhookManager } from './WebhookManager';

export class PluginWebhook extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('workflow.trigger', {
      title: tval('Trigger'),
      icon: 'trigger',
      Component: WebhookManager,
      sort: -100,
    });
  }
}
