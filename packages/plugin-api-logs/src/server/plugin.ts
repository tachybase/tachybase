import { isMainThread } from 'node:worker_threads';
import { Plugin } from '@tachybase/server';

import { handleUpdate } from './hooks/afterUpdate';

export class PluginApiLogsServer extends Plugin {
  async afterAdd() {
    if (!isMainThread) {
      this.addApiListener();
    }
  }

  async beforeLoad() {
    if (isMainThread) {
      this.addApiListener();
    }
  }

  async addApiListener() {
    this.app.resourcer.use(
      async (ctx, next) => {
        const { actionName, resourceName, params } = ctx.action;
        // const { showAnonymous } = params || {};
        if (actionName === 'update') {
          handleUpdate(ctx);
        }
        await next();
      },
      { tag: 'apiLogs', after: ['auth'] },
    );
  }

  async load() {}

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginApiLogsServer;
