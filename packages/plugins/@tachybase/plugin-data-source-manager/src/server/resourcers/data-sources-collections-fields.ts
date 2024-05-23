import lodash from 'lodash';

export default {
  name: 'dataSourcesCollections.fields',
  actions: {
    async list(ctx, next) {
      const { associatedIndex: collectionNameWithDataSourceKey } = ctx.action.params;
      const [dataSourceKey, collectionName] = collectionNameWithDataSourceKey.split('.');

      const dataSource = ctx.app.dataSourceManager.dataSources.get(dataSourceKey);
      const collection = dataSource.collectionManager.getCollection(collectionName);

      const fields = collection.getFields();

      ctx.body = lodash.sortBy(
        fields.map((field) => field.options),
        'name',
      );

      await next();
    },

    async get(ctx, next) {
      const { associatedIndex: collectionNameWithDataSourceKey, filterByTk: name } = ctx.action.params;
      const [dataSourceKey, collectionName] = collectionNameWithDataSourceKey.split('.');

      const dataSource = ctx.app.dataSourceManager.dataSources.get(dataSourceKey);
      const collection = dataSource.collectionManager.getCollection(collectionName);

      const field = collection.getField(name);

      ctx.body = field.options;

      await next();
    },

    async update(ctx, next) {
      const { associatedIndex: collectionNameWithDataSourceKey, filterByTk: name, values } = ctx.action.params;
      const [dataSourceKey, collectionName] = collectionNameWithDataSourceKey.split('.');

      const mainDb = ctx.app.db;

      let fieldRecord = await mainDb.getRepository('dataSourcesFields').findOne({
        filter: {
          name,
          collectionName,
          dataSourceKey,
        },
      });

      if (!fieldRecord) {
        fieldRecord = await mainDb.getRepository('dataSourcesFields').create({
          values: {
            ...values,
            name,
            collectionName: collectionName,
            dataSourceKey,
          },
        });
      } else {
        await fieldRecord.update({
          ...values,
        });
      }

      const field = ctx.app.dataSourceManager.dataSources
        .get(dataSourceKey)
        .collectionManager.getCollection(collectionName)
        .getField(name);
      ctx.body = field.options;

      await next();
    },

    async create(ctx, next) {
      const { associatedIndex: collectionNameWithDataSourceKey, values } = ctx.action.params;
      const [dataSourceKey, collectionName] = collectionNameWithDataSourceKey.split('.');

      const mainDb = ctx.app.db;

      const name = values.name;
      if (
        await mainDb.getRepository('dataSourcesFields').findOne({
          filter: {
            name,
            collectionName,
            dataSourceKey,
          },
        })
      ) {
        throw new Error(
          `Field name ${name} already exists in collection ${collectionName} of data source ${dataSourceKey}`,
        );
      }

      const fieldRecord = await mainDb.getRepository('dataSourcesFields').create({
        values: {
          ...values,
          collectionName,
          dataSourceKey,
        },
      });

      ctx.body = fieldRecord.toJSON();

      await next();
    },

    async destroy(ctx, next) {
      const { associatedIndex: collectionNameWithDataSourceKey, filterByTk: name } = ctx.action.params;
      const [dataSourceKey, collectionName] = collectionNameWithDataSourceKey.split('.');

      const mainDb = ctx.app.db;

      const fieldRecord = await mainDb.getRepository('dataSourcesFields').findOne({
        filter: {
          name,
          collectionName,
          dataSourceKey,
        },
      });

      if (fieldRecord) {
        await fieldRecord.destroy();
      }

      ctx.body = 'ok';

      await next();
    },
  },
};
