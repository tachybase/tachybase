import path from 'path';
import { Model } from '@tachybase/database';
import Application, { Plugin } from '@tachybase/server';

import lodash from 'lodash';

import { WebhookController } from './webhooks';

export class PluginWebhook extends Plugin {
  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    this.app.resourcer.define({
      name: 'webhooks',
      actions: {
        trigger: new WebhookController().getLink,
        test: new WebhookController().test,
      },
    });
    this.app.acl.allow('webhooks', ['trigger', 'test'], 'loggedIn');

    const app = this.app as Application;
    this.app.acl.use(
      async (ctx, next) => {
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
