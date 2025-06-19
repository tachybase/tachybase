import { Migration } from '@tachybase/server';

import { QueryTypes } from 'sequelize';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.46';

  async up() {
    // 获取当前数据库中所有表名
    const tables: string[] = await this.db.sequelize.getQueryInterface().showAllTables();
    if (!tables.includes('webhooks')) {
      this.app.logger.info(`[migration skipped] table webhooks does not exist`);
      return;
    }
    const sql = `
      UPDATE "webhooks"
      SET "options" = jsonb_build_object(
        'resourceName', "resourceName",
        'actionName', "actionName",
        'eventName', "eventName",
        'triggerOnAssociation', "triggerOnAssociation"
      )
    `;
    const result = await this.db.sequelize.query(sql, { type: QueryTypes.UPDATE });
    this.app.logger.info(`[webhooks] updated: ${result[1]}rows`);
  }
}
