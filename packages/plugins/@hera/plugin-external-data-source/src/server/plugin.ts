import { Plugin } from '@nocobase/server';
import { PostgresDataSource } from './postgres-data-source';

export class PluginExternalDataSourceServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {
    this.app.dataSourceManager.factory.register('postgres', PostgresDataSource);
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
