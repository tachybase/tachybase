import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.38';

  async up() {
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-workflow',
      },
      values: {
        packageName: '@tachybase/module-workflow',
      },
    });
  }
}
