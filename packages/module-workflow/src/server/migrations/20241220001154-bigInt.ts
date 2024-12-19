import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.86';

  async up() {
    await this.db.sequelize.query(`
      ALTER TABLE executions
      ALTER COLUMN "parentNode" TYPE BIGINT USING "parentNode"::BIGINT;
    `);
    await this.db.sequelize.query(`
      ALTER TABLE jobs
      ALTER COLUMN cost TYPE BIGINT USING cost::BIGINT;
    `);
    this.app.logger.info('change bigint success!');
  }
}
