import { PluginWorkflow } from '@tachybase/module-workflow';

import { EventSourceModel } from '../types';
import { evalSimulate } from '../utils/eval-simulate';
import { EventSourceTrigger } from './Trigger';

export class AppEventTrigger extends EventSourceTrigger {
  load(model: EventSourceModel) {
    const { eventName, workflowKey, code } = model;
    this.app.logger.info('Add application event listener', { meta: { eventName, workflowKey } });

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
        this.app.logger.error(err);
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

  async ifEffective() {
    return true;
  }
}
