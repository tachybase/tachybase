import { Migration } from '@tachybase/server';

export default class RemoveBuitInAuditLogsMigration extends Migration {
  on = 'beforeLoad';
  appVersion = '<0.21.7';
  async up() {
    await this.pm.repository.destroy({
      filter: {
        packageName: '@tachybase/module-audit-logs',
      },
    });
  }
}
