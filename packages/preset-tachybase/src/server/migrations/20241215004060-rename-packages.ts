import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.72';

  async up() {
    await this.pm.repository.destroy({
      filter: {
        packageName: '@hera/plugin-rental',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-messages',
      },
      values: {
        packageName: '@tachybase/module-message',
        name: 'message',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-ui-schema-storage',
      },
      values: {
        packageName: '@tachybase/module-ui-schema',
        name: 'ui-schema',
      },
    });
  }
}
