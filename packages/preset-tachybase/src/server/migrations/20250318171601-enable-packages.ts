import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.62';

  async up() {
    const isExisted = await this.pm.repository.findOne({
      filter: {
        packageName: '@tachybase/plugin-auth-pages',
      },
    });

    if (isExisted) {
      await this.pm.repository.update({
        filter: {
          packageName: '@tachybase/plugin-auth-pages',
        },
        values: {
          enabled: true,
          installed: true,
        },
      });
    }
  }
}
