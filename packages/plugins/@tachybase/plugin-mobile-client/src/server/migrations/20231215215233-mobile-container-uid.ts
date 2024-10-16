import { Model } from '@tachybase/database';
import { Migration } from '@tachybase/server';

export default class extends Migration {
  appVersion = '<0.17.0-alpha.8';
  async up() {
    const result = await this.app.version.satisfies('<0.17.0-alpha.8');
    if (!result) {
      return;
    }
    const systemSettings = this.db.getRepository('systemSettings');
    const instance: Model = await systemSettings.findOne();
    if (!instance?.options?.mobileSchemaUid) {
      return;
    }
    const UiSchemas = this.db.getModel('uiSchemas');
    await this.db.sequelize.transaction(async (transaction) => {
      await UiSchemas.update(
        {
          'x-uid': 'default-admin-mobile',
        },
        {
          transaction,
          where: {
            'x-uid': instance?.options?.mobileSchemaUid,
          },
        },
      );
      await this.db.getModel('uiSchemaTreePath').update(
        {
          descendant: 'default-admin-mobile',
        },
        {
          transaction,
          where: {
            descendant: instance?.options?.mobileSchemaUid,
          },
        },
      );
      await this.db.getModel('uiSchemaTreePath').update(
        {
          ancestor: 'default-admin-mobile',
        },
        {
          transaction,
          where: {
            ancestor: instance?.options?.mobileSchemaUid,
          },
        },
      );
    });
    console.log(instance?.options?.mobileSchemaUid);
  }
}
