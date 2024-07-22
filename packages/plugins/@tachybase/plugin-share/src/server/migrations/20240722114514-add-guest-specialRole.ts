import { Migration } from '@tachybase/server';

export default class AddGuestSpecialRoleMigration extends Migration {
  appVersion = '<0.21.88';

  async up() {
    const repo = this.context.db.getRepository('users');
    const user = await repo.findOne({
      filter: {
        username: 'guest',
      },
    });
    if (user) {
      await repo.update({
        values: {
          specialRole: 'guest',
        },
        filter: {
          id: user.id,
        },
      });
    } else {
      throw new Error('Guest user not found');
    }
  }

  async down() {}
}
