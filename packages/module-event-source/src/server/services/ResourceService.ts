import { Context } from '@tachybase/actions';
import { Application, Logger } from '@tachybase/server';
import { App, InjectLog, Service } from '@tachybase/utils';

import { WebhookController } from '../webhooks/webhooks';

@Service()
export class ResourceService {
  @App()
  private readonly app: Application;

  @InjectLog()
  private readonly logger: Logger;

  async load() {
    this.app.once('afterStart', async (app: Application) => {
      const webhooksRepo = app.db.getRepository('webhooks');
      const resources = await webhooksRepo.find({
        filter: {
          enabled: true,
          type: 'resource',
        },
      });

      for (const resourceDef of resources) {
        const { actionName, resourceName } = resourceDef;
        if (!app.resourcer.isDefined(resourceName)) {
          app.resourcer.define({ name: resourceName });
        }
        if (app.resourcer.getResource(resourceName).actions.has(actionName)) {
          this.logger.warn(`${resourceName}:${actionName} action handler exists`);
          // pass when exists
          continue;
        }
        this.logger.info(`Add ${resourceName}:${actionName} action handler`);
        app.resourcer.getResource(resourceName).addAction(actionName, async (ctx: Context) => {
          const body = await new WebhookController().action(ctx, resourceDef);
          await new WebhookController().triggerWorkflow(ctx, resourceDef, body);
        });
        app.acl.allow(resourceName, actionName, 'loggedIn');
      }
    });
  }
}
