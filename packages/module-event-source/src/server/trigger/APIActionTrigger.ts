import { Context } from '@tachybase/actions';
import { lodash } from '@tachybase/utils';

import { EventSourceModel } from '../model/EventSourceModel';
import { WebhookController } from '../webhooks/webhooks';
import { EventSourceTrigger } from './Trigger';

/**
 * 兼容旧版action的写法
 */
export class APIActionTrigger extends EventSourceTrigger {
  actionList: EventSourceModel[] = [];

  load(model: EventSourceModel) {
    this.actionList.push(model);
  }

  afterAllLoad() {
    const app = this.app;
    app.acl.use(
      async (ctx: Context, next) => {
        if (lodash.isEmpty(ctx.action.params)) {
          return next();
        }
        const { resourceName, actionName } = ctx.action;
        const actionObj = {};
        const actionList = this.actionList.filter((action) => {
          return resourceName === action.resourceName && actionName === action.actionName;
        });
        if (!actionList.length) {
          return next();
        }
        for (const action of actionList) {
          actionObj[action.id] = await new WebhookController().action(ctx, action);
        }
        await next();
        for (const action of actionList) {
          await new WebhookController().triggerWorkflow(ctx, action, actionObj[action.id]);
        }
      },
      { tag: 'api-webhook', after: 'core' },
    );
  }

  afterCreate(model: EventSourceModel) {
    this.actionList.push(model);
  }

  afterUpdate(model: EventSourceModel) {
    const index = this.actionList.findIndex((item) => item.id === model.id);
    if (!model.enabled) {
      if (index !== -1) {
        this.actionList.splice(index, 1);
      }
      return;
    }
    if (index !== -1) {
      this.actionList[index] = model;
    } else {
      this.actionList.push(model);
    }
  }

  afterDestroy(model: EventSourceModel) {
    const index = this.actionList.findIndex((item) => item.id === model.id);
    if (index !== -1) {
      this.actionList.splice(index, 1);
    }
  }
}
