import { Model } from '@tachybase/database';

export class EventSourceModel extends Model {
  id: number;
  name: string;
  type: string;
  enabled: boolean;
  code: string;
  workflowKey: string;
  options: {
    resourceName?: string;
    actionName?: string;
    // 针对app,db
    eventName?: string;
    // 针对beforeResource,afterResource
    triggerOnAssociation?: boolean;
    // 优先级越小越先执行
    sort?: number;
  };
}
