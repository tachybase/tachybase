import { MagicAttributeModel } from '@tachybase/database';
import { Application } from '@tachybase/server';

export class DataSourcesCollectionModel extends MagicAttributeModel {
  load(loadOptions: { app: Application; transaction: any }) {
    const { app } = loadOptions;

    const collectionOptions = this.get();
    const dataSourceName = this.get('dataSourceKey');
    const dataSource = app.dataSourceManager.dataSources.get(dataSourceName);
    const collection = dataSource.collectionManager.getCollection(collectionOptions.name);
    collection?.updateOptions(collectionOptions);
  }
}
