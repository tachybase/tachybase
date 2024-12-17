import { PluginWorkflow } from '@tachybase/module-workflow';
import { Application, Logger } from '@tachybase/server';
import { App, InjectLog, Service } from '@tachybase/utils';

import { evalSimulate } from '../utils/eval-simulate';

@Service()
export class ApplicationEventService {
  @App()
  private readonly app: Application;

  @InjectLog()
  private readonly logger: Logger;

  async load() {
    const webhooksRepo = this.app.db.getRepository('webhooks');
    const resources = await webhooksRepo.find({
      filter: {
        enabled: true,
        type: 'applicationEvent',
      },
    });

    for (const resourceDef of resources) {
      const { eventName, workflowKey, code } = resourceDef;
      this.logger.info('Add application event listener', { meta: { eventName, workflowKey } });

      this.app.on(eventName, async () => {
        const webhookCtx = {
          body: '',
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
        const pluginWorkflow = this.app.getPlugin(PluginWorkflow) as PluginWorkflow;
        const wfRepo = this.app.db.getRepository('workflows');
        const wf = await wfRepo.findOne({ filter: { key: workflowKey, enabled: true } });
        await pluginWorkflow.trigger(wf, { data: webhookCtx.body }, {});
      });
    }
  }
}
