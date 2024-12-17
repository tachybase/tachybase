import { Collection } from '@tachybase/database';
import { Migration } from '@tachybase/server';

import _ from 'lodash';

import { FieldModel } from '../models';

export default class extends Migration {
  appVersion = '<0.10.0-alpha.3';
  async up() {
    const transaction = await this.db.sequelize.transaction();

    const migrateFieldsSchema = async (collection: Collection) => {
      this.app.logger.info(`Start to migrate ${collection.name} collection's ui schema`);

      const fieldRecords: Array<FieldModel> = await collection.repository.find({
        transaction,
        filter: {
          type: ['bigInt', 'float', 'double'],
        },
      });

      this.app.logger.info(`Total ${fieldRecords.length} fields need to be migrated`);

      for (const fieldRecord of fieldRecords) {
        const uiSchema = fieldRecord.get('uiSchema');
        if (uiSchema?.['x-component-props']?.step !== '0') {
          continue;
        }
        _.set(uiSchema, 'x-component-props.step', '1');
        fieldRecord.set('uiSchema', uiSchema);
        await fieldRecord.save({
          transaction,
        });
        console.log(`changed: ${fieldRecord.get('collectionName')}.${fieldRecord.get('name')}`);
      }
    };

    try {
      await migrateFieldsSchema(this.db.getCollection('fields'));
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      this.app.logger.error(error);
      throw error;
    }
  }
}
