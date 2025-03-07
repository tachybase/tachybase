import { InjectedPlugin, Plugin } from '@tachybase/server';

import { CronJobsController } from './actions/cron-jobs-controller';
import { CronJobModel } from './model/CronJobModel';
import { StaticScheduleTrigger } from './service/StaticScheduleTrigger';

@InjectedPlugin({
  Controllers: [CronJobsController],
  Services: [StaticScheduleTrigger],
})
export class PluginCronJobServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {
    this.app.db.registerModels({
      CronJobModel,
    });
  }

  async load() {
    this.app.acl.registerSnippet({
      name: 'pm.system-services.cron',
      actions: ['cronJobs:*'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginCronJobServer;
