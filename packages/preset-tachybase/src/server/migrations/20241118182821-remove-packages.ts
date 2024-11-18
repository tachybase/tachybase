import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.38';

  async up() {
    // coding
    await this.pm.repository.destroy({
      filter: {
        packageName: '@tachybase/plugin-workflow-approval-mobile',
      },
    });
  }
}
