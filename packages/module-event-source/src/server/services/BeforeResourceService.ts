import { Context } from '@tachybase/actions';
import { Application, Logger } from '@tachybase/server';
import { App, InjectLog, Service } from '@tachybase/utils';

import { WebhookController } from '../webhooks/webhooks';

@Service()
export class BeforeAfterResourceService {
  ResourceKey = Symbol.for('Resource');

  @App()
  private readonly app: Application;

  @InjectLog()
  private readonly logger: Logger;

  async load() {
    this.app.once('afterStart', async (app: Application) => {
      // TODO wait for new design
      app[this.ResourceKey] ??= new Set();

      const webhooksRepo = app.db.getRepository('webhooks');
      for (const prefix of ['before', 'after']) {
        const resources = await webhooksRepo.find({
          filter: {
            enabled: true,
            type: `${prefix}Resource`,
          },
        });

        for (const resourceDef of resources) {
          const { actionName, resourceName, name } = resourceDef;
          this.logger.info(`Add ${prefix} resource middleware for ${resourceName}:${actionName}`);
          const tag = `${prefix}-resource-${resourceName}-${actionName}-${name}`;
          if (app[this.ResourceKey].has(tag)) {
            this.logger.warn(`${prefix} resource middleware for ${resourceName}:${actionName} exsists, skip`);
            continue;
          }
          app.resourcer.use(
            async (ctx: Context, next: () => Promise<void>) => {
              const { resourceName, actionName } = ctx.action;
              if (resourceName !== resourceDef.resourceName || actionName !== resourceDef.actionName) {
                return await next();
              }
              if (prefix === 'before') {
                const body = await new WebhookController().action(ctx, resourceDef);
                await new WebhookController().triggerWorkflow(ctx, resourceDef, body);
                await next();
              } else {
                await next();
                const body = await new WebhookController().action(ctx, resourceDef);
                await new WebhookController().triggerWorkflow(ctx, resourceDef, body);
              }
            },
            { tag },
          );
          app[this.ResourceKey].add(tag);
        }
      }
    });
  }
}
