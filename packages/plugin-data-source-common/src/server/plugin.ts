import Application, { Plugin, PluginOptions } from '@tachybase/server';

import { PluginHttpDatasource } from './http/plugin';
import { MySQLDataSource } from './mysql/mysql-data-source';
import { PostgresDataSource } from './pg/postgres-data-source';

export class PluginExternalDataSourceServer extends Plugin {
  constructor(app: Application, options?: PluginOptions) {
    super(app, options);
    this.addFeature(PluginHttpDatasource);
  }
  async afterAdd() {}

  async beforeLoad() {
    this.app.dataSourceManager.factory.register('postgres', PostgresDataSource);
    this.app.dataSourceManager.factory.register('mysql', MySQLDataSource);
  }
  async beforeEnable() {
    const plugin = this.pm.get('data-source');
    if (!plugin.enabled) {
      throw new Error(`${this.name} plugin need data source module enabled`);
    }
  }

  async load() {}

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginExternalDataSourceServer;
