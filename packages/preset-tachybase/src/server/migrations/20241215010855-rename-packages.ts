import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.72';

  async up() {
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-client',
      },
      values: {
        packageName: '@tachybase/module-web',
        name: 'web',
      },
    });
  }
}
