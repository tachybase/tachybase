import Application, { Plugin, PluginOptions } from '@tachybase/server';

import { PluginHttpDatasource } from './http/plugin';
import { HttpDataSource } from './http/services/http-data-source';
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
    this.app.dataSourceManager.factory.register('http', HttpDataSource);
  }
  async beforeEnable() {
    const plugin = this.pm.get('data-source');
    if (!plugin.enabled) {
      throw new Error(`${this.name} plugin need data source module enabled`);
    }
  }

  async load() {
    // 通过菜单权限数据源管理的管理员能够运行测试,crud任意操作
    this.app.acl.registerSnippet({
      name: 'pm.database-connections.manager',
      actions: ['dataSources.*:*'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginExternalDataSourceServer;
