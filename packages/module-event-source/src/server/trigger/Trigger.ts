import Application from '@tachybase/server';

import { EventSourceModel } from '../model/EventSourceModel';
import { IEventSourceTrigger } from '../types';

export class EventSourceTrigger implements IEventSourceTrigger {
  protected app: Application;
  protected realTimeRefresh = false;
  protected workSet: Set<number> = new Set();
  protected effectConfigMap: Map<number, any> = new Map();

  public getRealTimeRefresh() {
    return this.realTimeRefresh;
  }

  constructor(app: Application, realTimeRefresh = false) {
    this.app = app;
    this.realTimeRefresh = realTimeRefresh;
  }

  // 加载到中间件|事件(app,db,API)|API
  load(model: EventSourceModel) {}

  // 加载到中间件|事件(app,db,API)|API
  afterAllLoad() {}

  public workSetAdd(id: number) {
    this.workSet.add(id);
  }
  public workSetDelete(id: number) {
    this.workSet.delete(id);
  }
  public effectConfigSet(id: number, config: any) {
    this.effectConfigMap.set(id, config);
  }
  // 判断是否生效(中间件中执行)
  getEffect(model: EventSourceModel) {
    return this.workSet.has(model.id);
  }

  // 在type未发生变化的情况下发生变化
  changeWithOutType(model: EventSourceModel) {
    if (model.changed('type')) {
      return false;
    }
    if (!model.enabled) {
      return false;
    }
    return model.changed('workflowKey') || model.changed('code') || model.changed('options');
  }

  afterCreate(model: EventSourceModel) {}

  afterUpdate(model: EventSourceModel) {}

  afterDestroy(model: EventSourceModel) {}

  getEffectConfig(id: number) {
    const model = this.effectConfigMap.get(id);
    // 禁用状态为null
    if (!model) {
      return null;
    }
    const { enabled, type, options, workflowKey } = model;
    return JSON.stringify({ enabled, type, options, workflowKey }, null, 2);
  }
}
