import { Model } from '@tachybase/database';

export class EventSourceModel extends Model {
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
}
