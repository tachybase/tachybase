import { DataTypes } from '@tachybase/database';
import { Migration } from '@tachybase/server';

export default class AddUsersSpecialRoleMigration extends Migration {
  on = 'beforeLoad';
  appVersion = '<0.21.88';

  async up() {
    const collection = this.db.collection({
      name: 'users',
      fields: [
        {
          type: 'string',
          name: 'specialRole',
        },
      ],
    });
    const tableNameWithSchema = collection.getTableNameWithSchema();
    const field = collection.getField('specialRole');
    const exists = await field.existsInDb();
    if (!exists) {
      await this.db.sequelize.getQueryInterface().addColumn(tableNameWithSchema, field.columnName(), {
        type: DataTypes.STRING,
      });
    }
    try {
      await this.db.sequelize.getQueryInterface().addConstraint(tableNameWithSchema, {
        type: 'unique',
        fields: [field.columnName()],
      });
    } catch (error) {
      throw new Error(error);
    }
    const repo = this.context.db.getRepository('users');
    const user = await repo.findOne({
      filter: {
        email: process.env.INIT_ROOT_EMAIL || 'admin@tachybase.com',
      },
    });
    if (user) {
      await repo.update({
        values: {
          specialRole: 'root',
        },
        filter: {
          id: user.id,
        },
      });
    } else {
      throw new Error('Root user not found');
    }
  }

  async down() {}
}
