import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.47';

  async up() {
    // root user id
    const userRepo = this.context.db.getRepository('users');
    const appRepo = this.context.db.getRepository('applications');
    const rootUser = await userRepo.findOne({ filter: { specialRole: 'root' }, raw: true });
    const { id } = rootUser;
    const result = await appRepo.update({
      filter: {
        createdById: null,
      },
      values: { createdById: id, updateById: id },
    });
    console.log('[applications] add createdBy', result.length, 'rows');
  }
}
