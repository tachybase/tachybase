import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.28';
  async up() {
    try {
      const result: any = await this.app.db.sequelize.query(`
        UPDATE contracts
SET
   status = b.status
FROM project b
WHERE
    b.id = CASE
               WHEN contracts.project_id IS NOT NULL
               THEN contracts.project_id
               ELSE (
                   SELECT c.project_id
                   FROM contracts c
                   WHERE c.id = contracts.alternative_contract_id
               )
           END
    `);
      const count = result[1].rowCount || 0;
      console.log('共更新数据：' + count + '条');
    } catch (e) {
      this.app.logger.error(e);
    }
  }
}
