import { MagicAttributeModel, Transaction } from '@tachybase/database';
import { Application } from '@tachybase/server';

import { mergeOptions } from '../utils';

type LoadOptions = {
  app: Application;
};

export class DataSourcesFieldModel extends MagicAttributeModel {
  load(loadOptions: LoadOptions) {
    const { app } = loadOptions;

    const options = this.get();
    const { collectionName, name, dataSourceKey, field } = options;
    const dataSource = app.dataSourceManager.dataSources.get(dataSourceKey);
    const collection = dataSource.collectionManager.getCollection(collectionName);

    const oldFieldByName = collection.getField(name);
    const oldFieldByField = field ? collection.getFieldByField(field) : null;

    const oldField = oldFieldByField || oldFieldByName;
    const newOptions = mergeOptions(oldField ? oldField.options : {}, options);

    collection.setField(name, newOptions);

    if (oldFieldByField && !oldFieldByName) {
      const filedShouldRemove = collection
        .getFields()
        .filter((f) => f.options.field === field && f.options.name !== name);

      for (const f of filedShouldRemove) {
        collection.removeField(f.options.name);
      }
    }
  }

  unload(loadOptions: LoadOptions) {
    const { app } = loadOptions;
    const options = this.get();
    const { collectionName, name, dataSourceKey } = options;
    const dataSource = app.dataSourceManager.dataSources.get(dataSourceKey);
    if (!dataSource) {
      return;
    }
    const collection = dataSource.collectionManager.getCollection(collectionName);
    if (!collection) {
      return;
    }

    collection.removeField(name);
  }
}
