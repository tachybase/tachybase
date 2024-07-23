import { Migration } from '@tachybase/server';

export default class AddUsersSpecialRoleMigration extends Migration {
  on = 'afterLoad';
  appVersion = '<0.21.88';

  async up() {
    const repo = this.context.db.getRepository('users');
    await repo.update({
      filter: { $and: [{ roles: { title: { $includes: 'root' } } }] },
      values: {
        specialRole: 'root',
      },
    });
  }

  async down() {}
}
