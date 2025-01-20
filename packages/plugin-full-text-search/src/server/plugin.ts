import { Plugin } from '@tachybase/server';

import { searchMiddleware } from './middlewares/search';

export class PluginFullTextSearchServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.resourcer.use(searchMiddleware, {
      tag: 'full-text-search',
      after: 'acl',
      before: 'parseVariables',
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginFullTextSearchServer;
