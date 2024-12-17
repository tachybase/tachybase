import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.58';

  async up() {
    await this.pm.repository.destroy({
      filter: {
        packageName: '@hera/plugin-sancongtou',
      },
    });
  }
}
