import Application from '@tachybase/server';

import { EventSourceModel, IEventSourceTrigger } from '../types';

export class EventSourceTrigger implements IEventSourceTrigger {
  protected app: Application;

  protected realTimeRefresh = false;

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

  // 判断是否生效(中间件中执行)
  async ifEffective() {
    return true;
  }

  async afterCreate(model: EventSourceModel) {}

  async afterUpdate(model: EventSourceModel) {}

  async afterDestroy(model: EventSourceModel) {}
}
