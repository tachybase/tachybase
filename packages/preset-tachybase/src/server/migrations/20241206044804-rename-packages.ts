import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad';
  appVersion = '<0.22.59';

  async up() {
    const packages = [
      ['@tachybase/plugin-acl', '@tachybase/module-acl'],
      ['@tachybase/plugin-api-doc', '@tachybase/module-devtools', 'devtools'],
      ['@tachybase/plugin-api-keys', '@tachybase/module-api-keys'],
      ['@tachybase/plugin-audit-logs', '@tachybase/module-audit-logs'],
      ['@tachybase/plugin-auth', '@tachybase/module-auth'],
      ['@tachybase/plugin-backup-restore', '@tachybase/module-backup', 'backup-restore'],
      ['@tachybase/plugin-client', '@tachybase/module-client'],
      ['@tachybase/plugin-mobile-client', '@tachybase/module-client-mobile', 'client-mobile'],
      ['@tachybase/plugin-error-handler', '@tachybase/module-error-handler'],
    ];
    // coding
    const transaction = await this.db.sequelize.transaction();
    for (const p of packages) {
      this.app.logger.info(`rename ${p[0]} to ${p[1]}`);
      if (p[2]) {
        await this.pm.repository.update({
          filter: {
            packageName: p[0],
          },
          transaction,
          values: {
            name: p[2],
            packageName: p[1],
          },
        });
      } else {
        await this.pm.repository.update({
          filter: {
            packageName: p[0],
          },
          transaction,
          values: {
            packageName: p[1],
          },
        });
      }
    }
    await transaction.commit();
  }
}
