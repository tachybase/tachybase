import { Migration } from '@tachybase/server';

export default class AddAppTmplMigration extends Migration {
  appVersion = '<0.21.99';

  async up() {
    const Field = this.context.db.getRepository('fields');
    const existed = await Field.count({
      filter: {
        name: 'tmpl',
        collectionName: 'applications',
      },
    });
    if (!existed) {
      await Field.create({
        values: {
          name: 'tmpl',
          collectionName: 'applications',
          type: 'string',
          unique: true,
        },
      });
    }
  }

  async down() {}
}
