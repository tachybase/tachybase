import { Repository } from '@tachybase/database';
import { InjectedPlugin, Plugin } from '@tachybase/server';
import { Registry } from '@tachybase/utils';

import { EVENT_SOURCE_COLLECTION } from '../constants';
import { APIActionTrigger } from '../trigger/APIActionTrigger';
import { APIEventTrigger } from '../trigger/APIEventTrigger';
import { AppEventTrigger } from '../trigger/AppEventTrigger';
import { DbEventTrigger } from '../trigger/DbEvetnTrigger';
import { EventSourceTrigger } from '../trigger/Trigger';
import { EventSourceModel } from '../types';
import { WebhookController } from './webhooks';

@InjectedPlugin({
  Services: [
    // ResourceService,
    // DatabaseEventService,
    // ApplicationEventService,
    // BeforeAfterResourceService,
    // ActionAPIService,
  ],
})
export class PluginWebhook extends Plugin {
  triggers: Registry<EventSourceTrigger> = new Registry();

  async load() {
    this.app.resourcer.define({
      name: 'webhooks',
      actions: {
        trigger: new WebhookController().getLink,
        test: new WebhookController().test,
      },
    });
    this.app.acl.allow('webhooks', ['trigger', 'test'], 'loggedIn');

    this.triggers.register('action', new APIActionTrigger(this.app, true));
    this.triggers.register('databaseEvent', new DbEventTrigger(this.app));
    this.triggers.register('beforeResource', new APIEventTrigger(this.app));
    this.triggers.register('afterResource', new APIEventTrigger(this.app));
    this.triggers.register('applicationEvent', new AppEventTrigger(this.app));
  }

  async loadEventSources() {
    const repo = this.db.getRepository(EVENT_SOURCE_COLLECTION);
    const list = (await repo.find({
      filter: {
        enabled: true,
      },
    })) as EventSourceModel[];
    for (const item of list) {
      const trigger = this.triggers.get(item.type);
      trigger?.load(item);
    }

    for (const trigger of this.triggers.getValues()) {
      await trigger.afterAllLoad();
    }

    this.db.on(`${EVENT_SOURCE_COLLECTION}:afterCreate`, async (model: EventSourceModel) => {
      const trigger = this.triggers.get(model.type);
      if (trigger?.getRealTimeRefresh()) {
        await trigger.afterCreate(model);
      }
    });

    this.db.on(`${EVENT_SOURCE_COLLECTION}:afterUpdate`, async (model: EventSourceModel) => {
      const trigger = this.triggers.get(model.type);
      if (trigger?.getRealTimeRefresh()) {
        await trigger.afterUpdate(model);
      }
    });

    this.db.on(`${EVENT_SOURCE_COLLECTION}:afterDestroy`, async (model: EventSourceModel) => {
      const trigger = this.triggers.get(model.type);
      if (trigger?.getRealTimeRefresh()) {
        await trigger.afterDestroy(model);
      }
    });
  }
}
