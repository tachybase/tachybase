import { Context } from '@tachybase/actions';
import { JOB_STATUS, Processor } from '@tachybase/module-workflow';
import { Application, Logger } from '@tachybase/server';
import { App, InjectLog, Service } from '@tachybase/utils';

import { WebhookController } from '../webhooks/webhooks';

@Service()
export class BeforeAfterResourceService {
  @App()
  private readonly app: Application;

  @InjectLog()
  private readonly logger: Logger;

  async load() {
    this.app.once('afterStart', async (app: Application) => {
      const webhooksRepo = app.db.getRepository('webhooks');
      for (const prefix of ['before', 'after']) {
        const resources = await webhooksRepo.find({
          filter: {
            enabled: true,
            type: `${prefix}Resource`,
          },
        });

        for (const resourceDef of resources) {
          const { actionName, resourceName, name, triggerOnAssociation } = resourceDef;
          this.logger.info(`Add ${prefix} resource middleware for ${resourceName}:${actionName}`);
          const tag = `${prefix}-resource-${resourceName}-${actionName}-${name}`;
          app.resourcer.use(
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
              if (targetResource !== resourceDef.resourceName || actionName !== resourceDef.actionName) {
                return await next();
              }
              if (prefix === 'before') {
                const body = await new WebhookController().action(ctx, resourceDef);
                const result = await new WebhookController().triggerWorkflow(ctx, resourceDef, body);
                // TODO：这里只处理事务模式下运行把出错内容返回给客户端，同时阻止进一步行为
                if (result && result.lastSavedJob.status === JOB_STATUS.ERROR) {
                  ctx.throw(400, result.lastSavedJob.result);
                }
                await next();
              } else {
                await next();
                const body = await new WebhookController().action(ctx, resourceDef);
                await new WebhookController().triggerWorkflow(ctx, resourceDef, body);
              }
            },
            { tag, unique: true },
          );
        }
      }
    });
  }
}
