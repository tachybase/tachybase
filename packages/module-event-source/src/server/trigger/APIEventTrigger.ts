import { Context } from '@tachybase/actions';
import { JOB_STATUS } from '@tachybase/module-workflow';
import { Application } from '@tachybase/server';

import { EventSourceModel } from '../types';
import { WebhookController } from '../webhooks/webhooks';
import { EventSourceTrigger } from './Trigger';

export class APIEventTrigger extends EventSourceTrigger {
  load(model: EventSourceModel) {
    const { triggerOnAssociation, resourceName, actionName, name, type, id } = model;
    const prefix = type.substring(0, type.indexOf('Resource'));
    const tag = `${prefix}-resource-${resourceName}-${actionName}-${name}-${id}`;
    this.app.resourcer.use(
      async (ctx: Context, next: () => Promise<void>) => {
        const { resourceName, actionName } = ctx.action;
        let targetResource = resourceName || '';

        if (triggerOnAssociation) {
          const parts = resourceName.split('.');
          if (parts.length === 2) {
            const collection = ctx.db.getCollection(resourceName);
            targetResource = collection?.name;
          }
        }
        if (targetResource !== model.resourceName || actionName !== model.actionName) {
          return await next();
        }
        if (prefix === 'before') {
          const body = await new WebhookController().action(ctx, model);
          const result = await new WebhookController().triggerWorkflow(ctx, model, body);
          // TODO：这里只处理事务模式下运行把出错内容返回给客户端，同时阻止进一步行为
          if (result && result.lastSavedJob.status === JOB_STATUS.ERROR) {
            ctx.throw(400, result.lastSavedJob.result);
          }
          await next();
        } else {
          await next();
          const body = await new WebhookController().action(ctx, model);
          await new WebhookController().triggerWorkflow(ctx, model, body);
        }
      },
      { tag, unique: true },
    );
  }

  async ifEffective() {
    return false;
  }
}
