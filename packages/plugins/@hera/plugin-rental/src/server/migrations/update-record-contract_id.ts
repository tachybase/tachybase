import { Migration } from '@nocobase/server';

export default class extends Migration {
  appVersion = '<0.19.0-alpha.3';
  async up() {
    console.log('开始执行脚本：update-record-contract_id.ts');
    const result = await this.app.db.sequelize.query(
      `select
        r
      from records r
      join contracts c on c.id = r.contract_id and c.project_id is null
      `,
    );

    if (!result[0].length) {
      return;
    }
    await this.app.db.sequelize.query(
      `update records
      set contract_id = c.alternative_contract_id
      from contracts c
      where records.contract_id = c.id and c.project_id IS NULL;
      `,
    );
    console.log('更新了', result[0].length, '条数据');
    console.log('结束执行脚本：update-record-contract_id.ts');
  }

  async down() {}
}
