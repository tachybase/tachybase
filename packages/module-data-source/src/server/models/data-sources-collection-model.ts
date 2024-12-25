import { MagicAttributeModel, Model, Transaction } from '@tachybase/database';
import { Application } from '@tachybase/server';

export class DataSourcesCollectionModel extends MagicAttributeModel {
  async load(loadOptions: { app: Application; transaction: Transaction }) {
    const { app, transaction } = loadOptions;

    const collectionFields = await this.getFields({ transaction });

    const collectionOptions = this.get();
    collectionOptions.fields = collectionFields;

    const dataSourceName = this.get('dataSourceKey');
    const dataSource = app.dataSourceManager.dataSources.get(dataSourceName);
    const collection = dataSource.collectionManager.getCollection(collectionOptions.name);

    if (collectionOptions.fields) {
      collectionOptions.fields = collectionOptions.fields.map((field) => {
        if (field instanceof Model) {
          return field.get();
        }

        return field;
      });
    }

    if (collection) {
      collection.updateOptions(collectionOptions);
    } else {
      dataSource.collectionManager.defineCollection(collectionOptions);
    }

    return collection;
  }
}
