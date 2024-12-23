import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.8';

  async up() {
    await this.pm.repository.update({
      filter: {
        packageName: '@hera/plugin-core',
      },
      values: {
        packageName: '@tachybase/module-hera',
        name: 'hera',
      },
    });
  }
}
