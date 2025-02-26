import { isMainThread } from 'node:worker_threads';
import { Context } from '@tachybase/actions';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { ApiLogsController } from './actions/apiLogsController';
import { ApiFilter } from './ApiFilter';
import { handleCreate, handleDestroy, handleUpdate } from './hooks';

@InjectedPlugin({
  Controllers: [ApiLogsController],
})
export class PluginApiLogsServer extends Plugin {
  apiFilter: ApiFilter;

  async addApiListener() {
    this.apiFilter = new ApiFilter(this.db);
    this.app.on('afterStart', async () => {
      await this.apiFilter.load();
    });
    this.app.resourcer.use(
      async (ctx: Context, next) => {
        const { actionName, resourceName, params } = ctx.action;
        if (!this.apiFilter.check(resourceName, actionName)) {
          return next();
        }
        if (actionName === 'update') {
          return await handleUpdate(ctx, next);
        } else if (actionName === 'create') {
          return await handleCreate(ctx, next);
        } else if (actionName === 'destroy') {
          return await handleDestroy(ctx, next);
        }
        return next();
      },
      { tag: 'apiLogs', after: 'acl', before: 'dataSource' },
    );
  }

  async load() {
    if (isMainThread) {
      this.addApiListener();
    }
    this.app.acl.registerSnippet({
      name: `pm.system-services.apiLogsConfig`,
      actions: ['apiLogsConfig:*'],
    });
  }
}

export default PluginApiLogsServer;
