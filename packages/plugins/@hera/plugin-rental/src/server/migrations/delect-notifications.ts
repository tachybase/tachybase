import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'beforeLoad';
  appVersion = '<0.19.0-alpha.3';

  async up() {
    console.log('开始执行脚本：delect-notifications');
    await this.app.db.sequelize.query(`
      BEGIN;
      DELETE FROM system_message;
      DELETE FROM message_detail;
      DELETE FROM record_message;
      COMMIT;
      `);
    console.log('结束执行脚本：delect-notifications');
    console.log('数据删除完成');
  }

  async down() {}
}
