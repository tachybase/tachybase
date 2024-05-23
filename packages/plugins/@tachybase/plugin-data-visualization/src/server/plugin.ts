import { resolve } from 'path';
import { Cache } from '@tachybase/cache';
import { InstallOptions, Plugin } from '@tachybase/server';

import { query } from './actions/query';

export class DataVisualizationPlugin extends Plugin {
  cache: Cache;

  afterAdd() {}

  beforeLoad() {
    this.app.resource({
      name: 'charts',
      actions: {
        query,
      },
    });
    this.app.acl.allow('charts', 'query', 'loggedIn');
  }

  async load() {
    this.db.addMigrations({
      namespace: 'data-visulization',
      directory: resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });

    this.cache = await this.app.cacheManager.createCache({
      name: 'data-visualization',
      store: 'memory',
      ttl: 30 * 1000, // millseconds
      max: 1000,
    });
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default DataVisualizationPlugin;
