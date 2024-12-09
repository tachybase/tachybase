import { JOB_STATUS, PluginWorkflow, Processor } from '@tachybase/module-workflow';
import { Application, Logger } from '@tachybase/server';
import { App, InjectLog, Service } from '@tachybase/utils';

import { evalSimulate } from '../utils/eval-simulate';

@Service()
export class DatabaseEventService {
  @App()
  private readonly app: Application;

  @InjectLog()
  private readonly logger: Logger;

  async load() {
    const app = this.app;
    const webhooksRepo = app.db.getRepository('webhooks');
    const resources = await webhooksRepo.find({
      filter: {
        enabled: true,
        type: 'databaseEvent',
      },
    });

    for (const resourceDef of resources) {
      const { eventName, workflowKey, code } = resourceDef;
      this.logger.info('Add database event listener', { meta: { eventName, workflowKey } });

      app.db.on(eventName, async (model, options) => {
        const webhookCtx = {
          body: '',
          model,
          options,
        };
        try {
          await evalSimulate(code, {
            ctx: webhookCtx,
            lib: {
              JSON,
              Math,
            },
          });
        } catch (err) {
          this.logger.error(err);
        }
        // 只有绑定工作流才执行
        if (!workflowKey) {
          return;
        }
        // TODO: 执行人设置为创建这个任务的人/或者更新这个任务的人
        const pluginWorkflow = app.getPlugin(PluginWorkflow) as PluginWorkflow;
        const wfRepo = app.db.getRepository('workflows');
        const wf = await wfRepo.findOne({ filter: { key: workflowKey, enabled: true } });
        const result = (await pluginWorkflow.trigger(
          wf,
          { data: webhookCtx.body },
          { dbModel: model, dbOptions: options },
        )) as Processor;
        if (result?.lastSavedJob.status === JOB_STATUS.ERROR) {
          throw new Error(result.lastSavedJob?.result);
        }
      });
    }
  }
}
