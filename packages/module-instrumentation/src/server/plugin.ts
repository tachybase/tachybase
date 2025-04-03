import { isMainThread } from 'node:worker_threads';
import { Context } from '@tachybase/actions';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { TrackingController } from './actions/tracking-controller';
import { handleCreate, handleDestroy, handleUpdate } from './hooks';
import { ServerTrackingFilter } from './ServerTrackingFilter';

@InjectedPlugin({
  Controllers: [TrackingController],
})
export class ModuleInstrumentationServer extends Plugin {
  serverTrackingFilter: ServerTrackingFilter = null;
  async addServerTrackingListener() {
    this.app.on('afterStart', async () => {
      this.serverTrackingFilter = new ServerTrackingFilter(this.db);
      await this.serverTrackingFilter.load();
    });
    this.app.resourcer.use(
      async (ctx: Context, next) => {
        const { actionName, resourceName, params } = ctx.action;
        if (!this.serverTrackingFilter?.check(resourceName, actionName)) {
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
      { tag: 'serverTrackingConfig', after: 'acl', before: 'dataSource' },
    );
  }

  async load() {
    if (isMainThread) {
      this.addServerTrackingListener();
    }
    this.app.acl.allow('instrumentation', '*', 'public');
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.clientTracking`,
      actions: ['trackingEvents:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.serverTrackingConfig`,
      actions: ['serverTrackingConfig:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.serverTracking`,
      actions: ['serverTracking:*'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default ModuleInstrumentationServer;
