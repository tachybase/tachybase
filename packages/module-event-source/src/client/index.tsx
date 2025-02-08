import { Plugin } from '@tachybase/client';
import { Registry } from '@tachybase/utils/client';

import { CustomEventSourcePane } from './custom-event-sources/CustomEventSourcePane';
import { tval } from './locale';
import { EventSourceTrigger } from './triggers';
import { APIActionTrigger } from './triggers/APIActionTrigger';
import { APITrigger } from './triggers/APITrigger';
import { APPEventTrigger } from './triggers/APPEventTrigger';
import { WebhookManager } from './webhook/WebhookManager';

export class ModuleEventSourceClient extends Plugin {
  triggers = new Registry<EventSourceTrigger>();

  async load() {
    this.triggers.register('resource', new APITrigger());
    this.triggers.register('action', new APIActionTrigger());
    this.triggers.register('applicationEvent', new APPEventTrigger());

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
