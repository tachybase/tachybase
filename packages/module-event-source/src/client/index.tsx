import { Plugin } from '@tachybase/client';

import { tval } from './locale';
import { WebhookManager } from './webhook/WebhookManager';

export class ModuleEventSourceClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('event-source', {
      title: tval('Event source'),
      icon: 'trigger',
      Component: WebhookManager,
      sort: -85,
    });
  }
}

export default ModuleEventSourceClient;
