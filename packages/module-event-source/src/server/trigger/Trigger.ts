import Application from '@tachybase/server';

import { EventSourceModel } from '../model/EventSourceModel';
import { IEventSourceTrigger } from '../types';

export class EventSourceTrigger implements IEventSourceTrigger {
  protected app: Application;
  protected realTimeRefresh = false;
  protected workSet: Set<number> = new Set();

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
  // 判断是否生效(中间件中执行)
  ifEffective(model: EventSourceModel) {
    return this.workSet.has(model.id);
  }

  afterCreate(model: EventSourceModel) {}

  afterUpdate(model: EventSourceModel) {}

  afterDestroy(model: EventSourceModel) {}
}
