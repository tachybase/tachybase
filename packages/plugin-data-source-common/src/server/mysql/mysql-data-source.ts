import { DataSource } from '@tachybase/data-source';
import { Database } from '@tachybase/database';

import { DatabaseIntrospector } from './database-introspector';
import { MySQLCollectionManager } from './mysql-collection-manager';
import typeInterfaceMap from './type-interface-map';

export class MySQLDataSource extends DataSource {
  static async testConnection(options) {
    const database = new Database({
      dialect: 'mysql',
      ...options,
    });
    try {
      await database.sequelize.authenticate();
    } catch (e) {
      throw e;
    } finally {
      await database.close();
    }
    return true;
  }
  async load(options) {
    const db = this.collectionManager.db;
    const introspector = new DatabaseIntrospector({
      db,
      typeInterfaceMap,
    });
    introspector.on('loadMessage', ({ message }) => {
      this.emit('loadMessage', { message });
    });
    const { localData } = options;
    const collections = await introspector.getCollections({
      localData,
    });
    const delayFields = new Map();
    for (const collection of collections) {
      try {
        const fields = collection.fields;
        for (const field of fields) {
          if (field.type === 'belongsToMany') {
            if (!delayFields.has(collection.name)) {
              delayFields.set(collection.name, []);
            }
            delayFields.get(collection.name).push(field);
          }
        }
        this.collectionManager.defineCollection({
          ...collection,
          fields: fields.filter((field) => field.type !== 'belongsToMany'),
          introspected: true,
        });
      } catch (e) {
        db.logger.error(`load collection failed, ${e}`);
        delayFields.delete(collection.name);
      }
    }
    for (const [name, fields] of delayFields.entries()) {
      try {
        for (const field of fields) {
          this.collectionManager.getCollection(name).setField(field.name, field);
        }
      } catch (e) {
        db.logger.error(`load belongs to many field failed, ${e}`);
      }
    }
  }
  createCollectionManager(options) {
    const database = new Database({
      dialect: 'mysql',
      ...options,
    });
    return new MySQLCollectionManager({
      database,
    });
  }
}
