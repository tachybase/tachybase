import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad';
  appVersion = '<0.22.21';

  async up() {
    const transaction = await this.db.sequelize.transaction();
    await this.pm.repository.update({
      filter: {
        packageName: '@hera/plugin-approval-mobile',
      },
      transaction,
      values: {
        name: 'workflow-approval-mobile',
        packageName: '@tachybase/plugin-workflow-approval-mobile',
        version: '0.22.20',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@hera/plugin-homepage',
      },
      transaction,
      values: {
        name: 'simple-cms',
        packageName: '@tachybase/plugin-simple-cms',
        version: '0.22.20',
      },
    });
    await transaction.commit();
  }
}
