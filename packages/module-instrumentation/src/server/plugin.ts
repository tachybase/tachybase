import { isMainThread } from 'node:worker_threads';
import { Context } from '@tachybase/actions';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { TrackingController } from './actions/tracking-controller';
import { handleOtherAction } from './hooks/afterAction';
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
        const { actionName, resourceName } = ctx.action;
        if (this.serverTrackingFilter?.check(resourceName, actionName)) {
          const whiteList = this.serverTrackingFilter.whiteList;
          return await handleOtherAction(ctx, next, whiteList);
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
    this.app.acl.allow('instrumentation', 'create', 'public');
    this.app.acl.allow('instrumentation', 'list', 'loggedIn');
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.clientTracking`,
      actions: ['trackingEvents:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.serverTrackingConfig`,
      actions: ['serverTrackingConfig:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.trackingStatistics`,
      actions: ['statisticsConfig:*'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default ModuleInstrumentationServer;
