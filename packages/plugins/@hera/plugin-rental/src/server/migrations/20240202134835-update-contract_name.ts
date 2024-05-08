import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.6';
  pluginVersion = '<=1.1.0-alpha.12';

  async up() {
    console.log('开始执行脚本：contract_update_name');
    const result: any = await this.app.db.sequelize.query(`
      UPDATE contracts
      SET name = REPLACE(name, '[自动生成]', '')
      WHERE name ILIKE '[自动生成]%';
    `);
    const count = result[1].rowCount || 0;
    console.log('共更新数据：' + count + '条');
    console.log('结束执行脚本：contract_update_name');
  }
}
