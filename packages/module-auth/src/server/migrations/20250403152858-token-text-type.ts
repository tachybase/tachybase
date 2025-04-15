import { DataTypes } from '@tachybase/database';
import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<1.0.10';

  async up() {
    // coding
    const queryInterface = this.db.sequelize.getQueryInterface();
    // 使用 changeColumn 方法来修改列的数据类型
    await queryInterface.changeColumn('tokenBlacklist', 'token', {
      type: DataTypes.TEXT,
    });

    this.app.logger.info('change tokenBlacklist token form string to text success!');
  }
}
