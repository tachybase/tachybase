import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.68';

  async up() {
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-system-settings',
      },
      values: {
        packageName: '@tachybase/module-app-info',
        name: 'app-info',
      },
    });
  }
}
