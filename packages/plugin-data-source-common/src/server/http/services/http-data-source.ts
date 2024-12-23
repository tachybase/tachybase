import { DataSource } from '@tachybase/data-source';

import _ from 'lodash';

import { HttpApiRepository } from './http-api-repository';
import { HttpCollectionManager } from './http-collection-manager';
import { normalizeRequestOptions } from './utils';

export class HttpDataSource extends DataSource {
  async load(options: { localData?: any } = {}) {
    const { localData } = options;
    for (const collectionName of Object.keys(localData)) {
      this.collectionManager.defineCollection(localData[collectionName]);
    }
  }
  createCollectionManager(options) {
    const collectionManager = new HttpCollectionManager({
      dataSource: this,
    });
    collectionManager.registerRepositories({
      Repository: HttpApiRepository,
    });
    return collectionManager;
  }
  requestConfig() {
    const configKeys = ['baseUrl', 'headers', 'variables', 'timeout', 'responseType'];
    const config = _.pick(this.options, configKeys);
    normalizeRequestOptions(config);
    return config;
  }
  publicOptions() {
    return _.pick(this.options, ['baseUrl', 'variables']);
  }
}
