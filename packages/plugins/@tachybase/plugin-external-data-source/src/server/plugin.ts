import { Plugin } from '@tachybase/server';
import { PostgresDataSource } from './pg/postgres-data-source';
import { MySQLDataSource } from './mysql/mysql-data-source';

export class PluginExternalDataSourceServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {
    this.app.dataSourceManager.factory.register('postgres', PostgresDataSource);
    this.app.dataSourceManager.factory.register('mysql', MySQLDataSource);
  }
  async beforeEnable() {
    const plugin = this.pm.get('data-source-manager');
    if (!plugin.enabled) {
      throw new Error(`${this.name} plugin need data-source-manager plugin enabled`);
    }
  }

  async load() {}

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginExternalDataSourceServer;
