import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.59';

  async up() {
    // coding
    const userRepo = this.context.db.getRepository('users');
    const workflowRepo = this.context.db.getRepository('workflows');
    const rootUser = await userRepo.findOne({
      filter: {
        specialRole: 'root',
      },
      raw: true,
    });
    const { id } = rootUser;
    const result = await workflowRepo.update({
      filter: {
        createdById: null,
      },
      values: { createdById: id, updatedById: id },
    });
    console.log('[workflows] add createdBy and updateBy', result.length, 'rows');
  }
}
