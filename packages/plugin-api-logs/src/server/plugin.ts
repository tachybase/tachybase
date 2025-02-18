import { isMainThread } from 'node:worker_threads';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { ApiLogsController } from './actions/apiLogsController';
import { ApiFilter } from './ApiFilter';
import { handleCreate, handleDestroy, handleUpdate } from './hooks';

@InjectedPlugin({
  Controllers: [ApiLogsController],
})
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
    const apiFilter = new ApiFilter(this.db);
    this.app.on('afterStart', async () => {
      await apiFilter.load();
    });
    this.app.resourcer.use(
      async (ctx, next) => {
        const { actionName, resourceName, params } = ctx.action;
        if (!apiFilter.check(resourceName, actionName)) {
          return next();
        }
        if (actionName === 'update') {
          handleUpdate(ctx);
        }
        if (actionName === 'create') {
          handleCreate(ctx);
        }
        if (actionName === 'destroy') {
          handleDestroy(ctx);
        }
        await next();
      },
      { tag: 'apiLogs', after: 'acl', before: 'dataSource' },
    );
  }

  async load() {
    this.app.acl.registerSnippet({
      name: `pm.system-services.apiLogsConfig`,
      actions: ['apiLogsConfig:*'],
    });
  }
}

export default PluginApiLogsServer;
