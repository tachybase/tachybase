import { Migration } from '@tachybase/server';

export default class RemoveBuitInAuditLogsMigration extends Migration {
  on = 'beforeLoad';
  appVersion = '<0.22.13';
  async up() {
    await this.pm.repository.destroy({
      filter: {
        packageName: '@tachybase/plugin-graph-collection-manager',
      },
    });
  }
}
