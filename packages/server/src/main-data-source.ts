import { DataSourceOptions, SequelizeDataSource } from '@tachybase/data-source';

export class MainDataSource extends SequelizeDataSource {
  init(options: DataSourceOptions = {}) {
    const { acl, resourceManager, database } = options;

    this.acl = acl;
    this.resourceManager = resourceManager;

    this.collectionManager = this.createCollectionManager({
      collectionManager: {
        database,
        collectionsFilter: (collection) => {
          return collection.options.loadedFromCollectionManager;
        },
      },
    });
  }
}
