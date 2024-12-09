import path from 'path';
import { Cache } from '@tachybase/cache';
import { Plugin } from '@tachybase/server';
import { Container } from '@tachybase/utils';

import { SqlLoader } from '@hera/plugin-core';

export class PluginRentalServer extends Plugin {
  cache: Cache;

  async load() {
    const sqlLoader = Container.get(SqlLoader);
    await sqlLoader.loadSqlFiles(path.join(__dirname, './sqls'));

    this.cache = await this.app.cacheManager.createCache({
      name: '@hera/plugin-rental',
      prefix: '@hera/plugin-rental',
      store: process.env.CACHE_DEFAULT_STORE || 'memory',
    });
  }
}

export default PluginRentalServer;
