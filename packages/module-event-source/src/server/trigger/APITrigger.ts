import { Context } from '@tachybase/actions';

import { EventSourceModel } from '../types';
import { WebhookController } from '../webhooks/webhooks';
import { EventSourceTrigger } from './Trigger';

export class APITrigger extends EventSourceTrigger {
  load(model: EventSourceModel) {
    const app = this.app;
    const { actionName, resourceName } = model;
    if (!app.resourcer.isDefined(resourceName)) {
      app.resourcer.define({ name: resourceName });
    }
    if (app.resourcer.getResource(resourceName).actions.has(actionName)) {
      app.logger.warn(`${resourceName}:${actionName} action handler exists`);
      // pass when exists
      return;
    }
    app.logger.info(`Add ${resourceName}:${actionName} action handler`);
    app.resourcer.getResource(resourceName).addAction(actionName, async (ctx: Context) => {
      const body = await new WebhookController().action(ctx, model);
      await new WebhookController().triggerWorkflow(ctx, model, body);
    });
    app.acl.allow(resourceName, actionName, 'loggedIn');
  }

  async ifEffective() {
    return false;
  }
}
