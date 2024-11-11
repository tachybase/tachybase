import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.21.84';
  async up() {
    const result: any = await this.app.db.sequelize.query(`
      UPDATE public."uiSchemas"
      SET name = REPLACE(name, 'custom.', '__custom.')
      WHERE name LIKE 'custom.%';
    `);
    const count = result[1].rowCount || 0;
    console.log('共更新数据：' + count + '条');
  }
}
