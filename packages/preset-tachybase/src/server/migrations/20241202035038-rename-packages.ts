import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.53';

  async up() {
    const packages = [
      ['snapshot-field', 'field-snapshot'],
      ['sequence-field', 'field-sequence'],
      ['formula-field', 'field-formula'],
      ['china-region', 'field-china-region'],
      ['iframe-block', 'block-presentation'],
      ['map', 'block-map'],
      ['kanban', 'block-kanban'],
      ['gantt', 'block-gantt'],
      ['comments', 'block-comments'],
      ['data-visualization', 'block-charts'],
      ['calendar', 'block-calendar'],
      ['import', 'action-import'],
      ['export', 'action-export'],
      ['custom-request', 'action-custom-request'],
    ];
    // coding
    const transaction = await this.db.sequelize.transaction();
    for (const p of packages) {
      this.app.logger.info(`rename ${p[0]} to ${p[1]}`);
      await this.pm.repository.update({
        filter: {
          name: p[0],
        },
        transaction,
        values: {
          name: p[1],
          packageName: '@tachybase/plugin-' + p[1],
        },
      });
    }
    await transaction.commit();
  }
}
