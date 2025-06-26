import { DataTypes } from '@tachybase/database';
import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<1.3.11';

  async up() {
    // 获取当前数据库中所有表名
    const tables: string[] = await this.db.sequelize.getQueryInterface().showAllTables();
    if (!tables.includes('apiKeys')) {
      this.app.logger.info(`[migration skipped] table webhooks does not exist`);
      return;
    }
    const queryInterface = this.db.sequelize.getQueryInterface();
    // 使用 changeColumn 方法来修改列的数据类型
    await queryInterface.changeColumn('apiKeys', 'token', {
      type: DataTypes.STRING(512),
    });

    this.app.logger.info('apiKeys token change string(512) success!');
  }
}
