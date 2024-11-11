import { Migration } from '@tachybase/server';

export default class extends Migration {
  appVersion = '<0.19.0-alpha.3';

  async up() {
    console.log('开始：更新错误合同规则时间');
    const result = await this.app.db.sequelize.query(
      `
      UPDATE contract_rule_items
      SET
        start_date = '2022-12-31 16:00:00 +00'
      WHERE start_date = '2023-01-01 00:00:00 +00';

      UPDATE contract_rule_items
      SET
        end_date = '2023-12-30 16:00:00 +00'
      WHERE end_date = '2023-12-31 00:00:00 +00';
      `,
    );

    console.log('更新了', result[1][0].rowCount, '条数据');

    console.log('结束：合同规则时间更新完成');
  }
  async down() {}
}
