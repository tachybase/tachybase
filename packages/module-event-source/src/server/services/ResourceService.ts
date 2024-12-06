import { Context } from '@tachybase/actions';
import Database from '@tachybase/database';
import { Application, Logger } from '@tachybase/server';
import { App, Db, InjectLog, Service } from '@tachybase/utils';

import { WebhookController } from '../webhooks/webhooks';

@Service()
export class ResourceService {
  @App()
  private readonly app: Application;

  @Db()
  private readonly db: Database;

  @InjectLog()
  private readonly logger: Logger;

  async load() {
    this.app.on('afterStart', async () => {
      const webhooksRepo = this.db.getRepository('webhooks');
      const resources = await webhooksRepo.find({
        filter: {
          enabled: true,
          type: 'resource',
        },
      });

      for (const resourceDef of resources) {
        const { actionName, resourceName } = resourceDef;
        if (!this.app.resourcer.isDefined(resourceName)) {
          this.app.resourcer.define({ name: resourceName });
        }
        if (this.app.resourcer.getResource(resourceName).actions.has(actionName)) {
          this.logger.warn(`${resourceName}:${actionName} action handler exists`);
          // pass when exists
          continue;
        }
        this.logger.info(`Add ${resourceName}:${actionName} action handler`);
        this.app.resourcer.getResource(resourceName).addAction(actionName, async (ctx: Context) => {
          const body = await new WebhookController().action(ctx, resourceDef);
          await new WebhookController().triggerWorkflow(ctx, resourceDef, body);
        });
        this.app.acl.allow(resourceName, actionName, 'loggedIn');
      }
    });
  }
}
