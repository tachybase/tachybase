import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.23';

  async up() {
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/module-department',
      },
      values: {
        packageName: '@tachybase/plugin-department',
      },
    });
  }
}
