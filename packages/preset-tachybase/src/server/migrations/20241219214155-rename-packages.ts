import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.86';

  async up() {
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-file-manager',
      },
      values: {
        packageName: '@tachybase/module-file',
        name: 'file',
      },
    });
  }
}
