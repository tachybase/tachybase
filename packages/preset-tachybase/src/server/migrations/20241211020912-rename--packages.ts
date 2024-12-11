import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.65';

  async up() {
    // coding
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-data-source-manager',
      },
      values: {
        packageName: '@tachybase/module-data-source',
        name: 'data-source',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-data-source-external',
      },
      values: {
        packageName: '@tachybase/plugin-data-source-common',
        name: 'data-source-common',
      },
    });
  }
}
