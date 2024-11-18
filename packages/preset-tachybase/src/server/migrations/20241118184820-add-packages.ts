import PluginApprovalClient from '@tachybase/plugin-approval/client';
import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.38';

  async up() {
    const isExisted = await this.pm.repository.findOne({
      filter: {
        packageName: '@hera/plugin-rental',
      },
    });

    if (isExisted) {
      // 添加新的审批插件
      await this.pm.add(PluginApprovalClient);
      await this.pm.enable('@tachybase/plugin-approval');
    }
  }
}
