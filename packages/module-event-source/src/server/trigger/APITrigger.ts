import { Context } from '@tachybase/actions';

import { EventSourceModel } from '../model/EventSourceModel';
import { WebhookController } from '../webhooks/webhooks';
import { EventSourceTrigger } from './Trigger';

type IAPITriggerConfig = {
  code: string;
  workflowKey: string;
};
export class APITrigger extends EventSourceTrigger {
  eventMap: Map<number, IAPITriggerConfig> = new Map();

  load(model: EventSourceModel) {
    const app = this.app;
    const { actionName, resourceName, id, code, workflowKey } = model;
    this.eventMap.set(id, { code, workflowKey });
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
      // 如果允许实时刷新,则间接禁用这个, TODO: 需要验证
      if (this.realTimeRefresh && !this.workSet.has(id)) {
        ctx.throw(404, 'Not found');
      }
      const { code, workflowKey } = this.eventMap.get(id);
      const body = await new WebhookController().action(ctx, { code });
      await new WebhookController().triggerWorkflow(ctx, { workflowKey }, body);
    });
    app.acl.allow(resourceName, actionName, 'loggedIn');
  }

  afterCreate(model: EventSourceModel) {
    this.load(model);
  }

  // TODO 很难修改和删除
  afterUpdate(model: EventSourceModel) {
    const { enabled, code, workflowKey, id } = model;
    if (enabled && !this.workSet.has(id)) {
      this.load(model);
    } else {
      this.eventMap.set(id, { code, workflowKey });
    }
  }
}
