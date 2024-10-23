import path, { resolve } from 'path';
import { Cache } from '@tachybase/cache';
import { InstallOptions, Plugin } from '@tachybase/server';
import { Container } from '@tachybase/utils';

import { query } from './actions/query';
import { SqlLoader } from './services/sql-loader';

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
    const sqlLoader = Container.get(SqlLoader);
    await sqlLoader.loadSqlFiles(path.join(__dirname, './sqls'));
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
