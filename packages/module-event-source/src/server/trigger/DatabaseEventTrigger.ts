import { JOB_STATUS, PluginWorkflow, Processor } from '@tachybase/module-workflow';

import { EventSourceModel } from '../model/EventSourceModel';
import { evalSimulate } from '../utils/eval-simulate';
import { EventSourceTrigger } from './Trigger';

export class DatabaseEventTrigger extends EventSourceTrigger {
  eventMap: Map<number, (...args: any[]) => void> = new Map();

  load(model: EventSourceModel) {
    const {
      options: { eventName },
      workflowKey,
      code,
    } = model;
    this.app.logger.info('Add database event listener', { meta: { eventName, workflowKey } });
    const callback = this.getDbEvent(model).bind(this);
    this.app.db.on(eventName, callback);
    this.eventMap.set(model.id, callback);
  }

  getDbEvent(model: EventSourceModel) {
    const { code, workflowKey } = model;
    return async (model, options) => {
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
      const result = (await pluginWorkflow.trigger(
        wf,
        { data: webhookCtx.body },
        { dbModel: model, dbOptions: options },
      )) as Processor;
      if (result?.lastSavedJob.status === JOB_STATUS.ERROR) {
        throw new Error(result.lastSavedJob?.result);
      }
    };
  }

  afterCreate(model: EventSourceModel) {
    this.load(model);
  }

  afterUpdate(model: EventSourceModel) {
    if (model.enabled && !this.workSet.has(model.id)) {
      this.load(model);
    } else if (!model.enabled && this.workSet.has(model.id)) {
      this.app.db.off(model.options.eventName, this.eventMap.get(model.id));
      this.eventMap.delete(model.id);
    }
  }

  afterDestroy(model: EventSourceModel) {
    const callback = this.eventMap.get(model.id);
    if (!callback) {
      return;
    }
    this.app.db.off(model.options.eventName, callback);
    this.eventMap.delete(model.id);
  }
}
