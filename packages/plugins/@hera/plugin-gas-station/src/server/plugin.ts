import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';

export class PluginGasStationServer extends Plugin {
  afterAdd() {}

  beforeLoad() {}

  async load() {
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections'),
    });
  }

  async install(options?: InstallOptions) {
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('books');
    }
  }

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginGasStationServer;
