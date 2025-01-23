import { Repository } from '@tachybase/database';
import { InjectedPlugin, Plugin } from '@tachybase/server';
import { Registry } from '@tachybase/utils';

import { EVENT_SOURCE_COLLECTION, EVENT_SOURCE_REALTIME } from '../constants';
import { EventSourceModel } from '../model/EventSourceModel';
import { APIActionTrigger } from '../trigger/APIActionTrigger';
import { APIEventTrigger } from '../trigger/APIEventTrigger';
import { APITrigger } from '../trigger/APITrigger';
import { AppEventTrigger } from '../trigger/AppEventTrigger';
import { DbEventTrigger } from '../trigger/DbEventTrigger';
import { EventSourceTrigger } from '../trigger/Trigger';
import { WebhookController } from './webhooks';

export class PluginWebhook extends Plugin {
  triggers: Registry<EventSourceTrigger> = new Registry();

  async beforeLoad() {
    this.app.db.registerModels({
      EventSourceModel: EventSourceModel,
    });
  }

  async load() {
    this.app.resourcer.define({
      name: 'webhooks',
      actions: {
        trigger: new WebhookController().getLink,
        test: new WebhookController().test,
      },
    });
    this.app.acl.allow('webhooks', ['trigger', 'test'], 'loggedIn');

    this.triggers.register('action', new APIActionTrigger(this.app, EVENT_SOURCE_REALTIME));
    this.triggers.register('databaseEvent', new DbEventTrigger(this.app, EVENT_SOURCE_REALTIME));
    this.triggers.register('beforeResource', new APIEventTrigger(this.app, EVENT_SOURCE_REALTIME));
    this.triggers.register('afterResource', new APIEventTrigger(this.app, EVENT_SOURCE_REALTIME));
    this.triggers.register('applicationEvent', new AppEventTrigger(this.app, EVENT_SOURCE_REALTIME));
    this.triggers.register('resource', new APITrigger(this.app, EVENT_SOURCE_REALTIME));

    await this.loadEventSources();
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
      trigger?.workSetAdd(item.id);
    }

    for (const trigger of this.triggers.getValues()) {
      await trigger.afterAllLoad();
    }

    this.db.on(`${EVENT_SOURCE_COLLECTION}.afterCreate`, async (model: EventSourceModel) => {
      const trigger = this.triggers.get(model.type);
      if (!trigger?.getRealTimeRefresh()) {
        return;
      }
      if (model.enabled) {
        await trigger.afterCreate(model);
        trigger.workSetAdd(model.id);
      }
    });

    this.db.on(`${EVENT_SOURCE_COLLECTION}.beforeUpdate`, async (model: EventSourceModel, options) => {
      const trigger = this.triggers.get(model.type);
      if (!trigger?.getRealTimeRefresh()) {
        return;
      }
      // 修改了type的情况
      if (options.values.type && options.values.type !== model.type) {
        await trigger.afterDestroy(model);
        trigger.workSetDelete(model.id);
      }
    });

    this.db.on(`${EVENT_SOURCE_COLLECTION}.afterUpdate`, async (model: EventSourceModel, options) => {
      const trigger = this.triggers.get(model.type);
      if (!trigger?.getRealTimeRefresh()) {
        return;
      }
      await trigger.afterUpdate(model);
      // 修改了type的情况
      if (options.values.type && options.values.type !== model.type) {
        await trigger.afterCreate(model);
        trigger.workSetAdd(model.id);
        return;
      }
      if (model.enabled) {
        trigger?.workSetAdd(model.id);
      } else {
        trigger?.workSetDelete(model.id);
      }
    });

    this.db.on(`${EVENT_SOURCE_COLLECTION}.afterDestroy`, async (model: EventSourceModel) => {
      const trigger = this.triggers.get(model.type);
      if (!trigger?.getRealTimeRefresh()) {
        return;
      }
      await trigger.afterDestroy(model);
      trigger.workSetDelete(model.id);
    });
  }
}
