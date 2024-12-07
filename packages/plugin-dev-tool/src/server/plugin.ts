import { InjectedPlugin, Plugin } from '@tachybase/server';

import { MiddlewareController } from './actions/middleware-controller';

@InjectedPlugin({
  Controllers: [MiddlewareController],
})
export class PluginDevToolServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.middlewares`,
      actions: ['middlewares:*'],
    });
    // this.app.acl.allow('middlewares', 'get', 'public')
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginDevToolServer;
