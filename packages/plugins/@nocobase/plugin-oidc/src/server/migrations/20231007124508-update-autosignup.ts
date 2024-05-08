import { Migration } from '@tachybase/server';
import { authType } from '../../constants';

export default class UpdateAutoSignupMigration extends Migration {
  appVersion = '<0.14.0-alpha.8';
  async up() {
    const result = await this.app.version.satisfies('<=0.14.0-alpha.8');

    if (!result) {
      return;
    }

    const r = this.db.getRepository('authenticators');
    const items = await r.find({
      filter: {
        authType,
      },
    });

    await this.db.sequelize.transaction(async (transaction) => {
      for (const item of items) {
        let options = item.options;
        options = {
          public: { autoSignup: true, ...options.public },
          oidc: { userBindField: 'email', ...options.oidc },
        };
        item.set('options', options);
        await item.save({ transaction });
      }
    });
  }

  async down() {}
}
