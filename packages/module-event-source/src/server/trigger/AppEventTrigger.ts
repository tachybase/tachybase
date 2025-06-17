import { PluginWorkflow } from '@tachybase/module-workflow';

import { EventSourceModel } from '../model/EventSourceModel';
import { evalSimulate } from '../utils/eval-simulate';
import { EventSourceTrigger } from './Trigger';

export class AppEventTrigger extends EventSourceTrigger {
  eventMap: Map<number, (...args: any[]) => void> = new Map();

  load(model: EventSourceModel) {
    if (!model.options) {
      return;
    }
    const {
      options: { eventName },
      workflowKey,
    } = model;
    this.app.logger.info('Add application event listener', { meta: { eventName, workflowKey } });

    const callback = this.getAppEvent(model).bind(this);
    this.app.on(eventName, callback);
    this.eventMap.set(model.id, callback);
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
    } else if (this.changeWithOutType(model)) {
      const { eventName: oldEventName } = this.effectConfigMap.get(model.id).options ?? {};
      this.app.db.off(oldEventName, this.eventMap.get(model.id));
      this.eventMap.delete(model.id);
      this.load(model);
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

  private getAppEvent(model: EventSourceModel) {
    const { code, workflowKey } = model;
    return async () => {
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
    };
  }
}
