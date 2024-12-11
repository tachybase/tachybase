import { InjectedPlugin, Plugin } from '@tachybase/server';

import { CronJobsController } from './actions/CronJobsController';
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

  async load() {}

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginCronJobServer;
