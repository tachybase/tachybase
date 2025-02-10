import { Migration } from '@tachybase/server';

import { QueryTypes } from 'sequelize';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.42';

  async up() {
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
    this.app.logger.info(`[webhooks] 共更新数据：${result[1]}条`);
  }
}
