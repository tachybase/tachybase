import { Plugin } from '@tachybase/client';
import { Registry } from '@tachybase/utils/client';

import { CustomEventSourcePane } from './custom-event-sources/CustomEventSourcePane';
import { tval } from './locale';
import { EventSourceTrigger } from './triggers';
import { APPEventTrigger } from './triggers/APPEventTrigger';
import { CustomActionTrigger } from './triggers/CustomActionTrigger';
import { DatabaseEventTrigger } from './triggers/DatabaseEventTrigger';
import { ResourceEventTrigger } from './triggers/ResourceEventTrigger';
import { WebhookManager } from './webhook/WebhookManager';

export class ModuleEventSourceClient extends Plugin {
  triggers = new Registry<EventSourceTrigger>();

  async load() {
    this.triggers.register('resource', new CustomActionTrigger());
    this.triggers.register('applicationEvent', new APPEventTrigger());
    this.triggers.register('databaseEvent', new DatabaseEventTrigger());
    this.triggers.register(
      'beforeResource',
      new ResourceEventTrigger(
        tval('Resource action before event'),
        tval(
          'get user input and original data changes before operation, but the workflow is triggered before the resource operation, which is commonly used for data verification, etc.',
        ),
      ),
    );
    this.triggers.register(
      'afterResource',
      new ResourceEventTrigger(
        tval('Resource action after event'),
        tval(
          'get user input and original data changes before operation, but the workflow is triggered after the resource operation, which is commonly used for specific association changes, etc.',
        ),
      ),
    );

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
