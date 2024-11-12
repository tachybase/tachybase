import path from 'path';
import { Plugin } from '@tachybase/server';
import { Container } from '@tachybase/utils';

import { SqlLoader } from '@hera/plugin-core';

export class PluginSancongtouServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const sqlLoader = Container.get(SqlLoader);
    await sqlLoader.loadSqlFiles(path.join(__dirname, './sqls'));
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginSancongtouServer;
