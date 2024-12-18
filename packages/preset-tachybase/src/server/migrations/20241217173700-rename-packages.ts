import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.83';

  async up() {
    await this.pm.repository.destroy({
      filter: {
        packageName: '@tachybase/plugin-api-doc',
      },
    });
  }
}
