import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.4';
  pluginVersion = '<=1.0.0-alpha.0';
  async up() {
    console.log('开始执行脚本：record_category_script');
    const result: any = await this.app.db.sequelize.query(`
      UPDATE records
      SET record_category = 
        CASE 
          WHEN category = '1' AND movement = '1' THEN '2'
          WHEN category = '1' AND movement = '-1' THEN '3'
          WHEN category = '0' AND movement = '1' THEN '4'
          WHEN category = '0' AND movement = '-1' THEN '5'
          WHEN category = '2' AND movement = '1' THEN '6'
          WHEN category = '2' AND movement = '-1' THEN '7'
          WHEN (category = '3' OR category = '-1') AND movement = '1' THEN '8'
          WHEN (category = '3' OR category = '-1') AND movement = '-1' THEN '8'
          ELSE record_category
        END
    `);
    const count = result[1].rowCount || 0;
    console.log('共更新数据：' + count + '条');
    console.log('结束执行脚本：record_category_script');
  }
}
