import { Context } from '@tachybase/actions';
import { Application } from '@tachybase/server';
import { App, lodash, Service } from '@tachybase/utils';

import { WebhookController } from '../webhooks/webhooks';

@Service()
export class ActionAPIService {
  @App()
  private readonly app: Application;
  async load() {
    this.app.acl.use(
      async (ctx: Context, next) => {
        const app = this.app;
        if (lodash.isEmpty(ctx.action.params)) {
          await next();
          return;
        }
        const { resourceName, actionName } = ctx.action;
        const webhooksRepo = ctx.db.getRepository('webhooks');
        const actions = await app.cache.wrap(
          'webhooks',
          async () => {
            return await webhooksRepo.find({
              filter: {
                enabled: true,
                type: 'action',
              },
            });
          },
          30 * 60 * 1000,
        );
        const actionObj = {};
        const actionList = actions.filter((action) => {
          return resourceName === action['resourceName'] && actionName === action['actionName'];
        });
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
}
