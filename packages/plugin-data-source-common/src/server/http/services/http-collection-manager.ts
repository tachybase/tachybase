import { CollectionManager, CollectionOptions } from '@tachybase/data-source';

import { HttpCollection } from './http-collection';

export class HttpCollectionManager extends CollectionManager {
  public dataSource: any;
  constructor(options: { dataSource?: any } = {}) {
    super(options);
    this.dataSource = options.dataSource;
  }
  newCollection(options: CollectionOptions) {
    return new HttpCollection(options, this);
  }
}
