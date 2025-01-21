import { Application } from '@tachybase/server';

export type EventSourceModel = {
  id: number;
  name: string;
  type: string;
  resourceName: string;
  actionName: string;
  // 针对app,db
  eventName: string;
  triggerOnAssociation: boolean;
  enabled: boolean;
  code: string;
  workflowKey: string;
};

export interface IEventSourceTrigger {
  // 加载到中间件|事件(app,db,API)|API
  load: (model: EventSourceModel, app: Application) => void;

  // 判断是否生效(中间件中执行)
  ifEffective: () => Promise<boolean>;
}
