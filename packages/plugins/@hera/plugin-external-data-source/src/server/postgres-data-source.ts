import { DataSource } from '@tachybase/data-source-manager';
import { Database } from '@tachybase/database';
import { PostgresCollectionManager } from './postgres-collection-manager';
import { DatabaseIntrospector } from './services/database-introspector';
import typeInterfaceMap from './services/type-interface-map';

export class PostgresDataSource extends DataSource {
  static async testConnection(options) {
    const database = new Database({
      dialect: 'postgres',
      ...options,
    });
    try {
      await database.sequelize.authenticate();
      if (options.schema) {
        const queryRes = await database.sequelize.query(
          `
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = $1;
          `,
          {
            bind: [options.schema],
            type: 'SELECT',
          },
        );
        // @ts-ignore
        if (queryRes.length === 0) {
          throw new Error(`schema ${options.schema} not exists`);
        }
      }
    } catch (e) {
      throw e;
    } finally {
      await database.close();
    }
    return true;
  }
  async load(options) {
    // @ts-ignore
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
    const delayFields = /* @__PURE__ */ new Map();
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
      dialect: 'postgres',
      ...options,
    });
    return new PostgresCollectionManager({
      database,
    });
  }
}
