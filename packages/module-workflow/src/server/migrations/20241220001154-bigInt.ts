import { Migration } from '@tachybase/server';

import { DataTypes } from 'sequelize';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.86';

  async up() {
    const queryInterface = this.db.sequelize.getQueryInterface();
    // 使用 changeColumn 方法来修改列的数据类型
    await queryInterface.changeColumn('executions', 'parentNode', {
      type: DataTypes.BIGINT,
    });

    // 使用 changeColumn 方法来修改列的数据类型
    await queryInterface.changeColumn('jobs', 'cost', {
      type: DataTypes.BIGINT,
    });

    this.app.logger.info('change bigint success!');
  }
}
