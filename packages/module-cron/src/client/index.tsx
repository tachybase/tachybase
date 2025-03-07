import { Plugin } from '@tachybase/client';

import { NAMESPACE } from '../constants';
import { CronJobsTable } from './cron-jobs-table/CronJobsTable';

export class ModuleCronJobClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.systemSettingsManager.add('system-services.' + NAMESPACE, {
      title: this.t('Cron job'),
      icon: 'ScheduleOutlined',
      Component: CronJobsTable,
      sort: -15,
      aclSnippet: 'pm.system-services.cron',
    });
  }
}

export default ModuleCronJobClient;
