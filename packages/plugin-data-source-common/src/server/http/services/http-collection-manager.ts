import { CollectionManager, CollectionOptions } from '@tachybase/data-source-manager';

import { HttpCollection } from './http-collection';

export class HttpCollectionManager extends CollectionManager {
  constructor(options = {}) {
    super(options);
  }
  newCollection(options: CollectionOptions) {
    return new HttpCollection(options, this);
  }
}
