import { Migration } from '@tachybase/server';

import PluginCoreServer from '../plugin';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.23';

  async up() {
    const plugin = this.app.pm.get(PluginCoreServer);
    if (!plugin.enabled) {
      return;
    }
    // 开启hera的也必须开启department
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-department',
      },
      values: {
        installed: true,
        enabled: true,
      },
    });
    this.app.logger.info('enable plugin-department success!');
  }
}
