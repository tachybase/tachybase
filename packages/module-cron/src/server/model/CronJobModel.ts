import { Model } from '@tachybase/database';
import { WorkflowModel } from '@tachybase/module-workflow';

import { SCHEDULE_MODE } from '../../constants';

export class CronJobModel extends Model {
  declare id: number;
  declare title: string;
  declare description?: string;
  declare startsOn: Date;
  declare mode: SCHEDULE_MODE;
  declare endsOn?: Date;
  declare repeat: string;
  declare limit?: number;
  declare enabled: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare allExecuted: number;
  declare workflowKey: string;

  declare nextTime?: Date;

  declare limitExecuted: number;
}
