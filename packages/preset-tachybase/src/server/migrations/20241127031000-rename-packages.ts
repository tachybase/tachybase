import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.49';

  async up() {
    // coding
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-cloud-component',
      },
      values: {
        packageName: '@tachybase/module-cloud-component',
      },
    });
  }
}
