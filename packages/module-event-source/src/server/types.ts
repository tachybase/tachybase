import { Application } from '@tachybase/server';

import { EventSourceModel } from './model/EventSourceModel';

export interface IEventSourceTrigger {
  // 加载到中间件|事件(app,db,API)|API
  load: (model: EventSourceModel, app: Application) => void;

  // 判断是否生效(中间件中执行)
  ifEffective: (model: EventSourceModel) => boolean;
}
