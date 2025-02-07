import { Plugin } from '@tachybase/client';

import { CustomEventSourcePane } from './custom-event-sources/CustomEventSourcePane';
import { tval } from './locale';
import { WebhookManager } from './webhook/WebhookManager';

export class ModuleEventSourceClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('business-components.custom-event-source', {
      title: tval('Custom event source'),
      icon: 'trigger',
      Component: CustomEventSourcePane,
    });

    this.app.systemSettingsManager.add('business-components.event-source', {
      title: tval('Event source'),
      icon: 'trigger',
      Component: WebhookManager,
      sort: -100,
    });
  }
}

export default ModuleEventSourceClient;
