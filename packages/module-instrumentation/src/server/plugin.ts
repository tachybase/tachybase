import { isMainThread } from 'node:worker_threads';
import { Context } from '@tachybase/actions';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { MetricsController } from './actions/metrics-controller';
import { TrackingController } from './actions/tracking-controller';
import { handleOtherAction } from './hooks/afterAction';
import { ServerTrackingFilter } from './ServerTrackingFilter';
import { createUserMetricsMiddleware, initializeUserMetrics } from './user-metrics';

@InjectedPlugin({
  Controllers: [TrackingController, MetricsController],
})
export class ModuleInstrumentationServer extends Plugin {
  serverTrackingFilter: ServerTrackingFilter = null;
  async addServerTrackingListener() {
    this.app.on('afterStart', async () => {
      const SignInTracking = await this.app.db.getRepository('trackingConfig').findOne({
        filter: {
          title: 'sign-in',
          resourceName: 'auth',
          action: 'signIn',
        },
      });
      if (!SignInTracking) {
        await this.app.db.getRepository('trackingConfig').create({
          values: {
            title: 'sign-in',
            resourceName: 'auth',
            action: 'signIn',
            trackingOptions: {
              meta: ['userId', 'recordId', 'createdAt', 'user-agent'],
              filter: {
                $and: [
                  {
                    payload: {
                      errors: {
                        $exists: false,
                      },
                    },
                  },
                ],
              },
              payload: ['errors', 'account', 'phone'],
            },
          },
        });
      }
      this.serverTrackingFilter = new ServerTrackingFilter(this.db);
      await this.serverTrackingFilter.load();

      // 初始化用户指标系统
      try {
        const { userMetrics, statsCollector } = await initializeUserMetrics(this.db, true);

        // 添加用户指标中间件
        this.app.use(createUserMetricsMiddleware(userMetrics), {
          tag: 'userMetrics',
          before: 'errorHandler',
        });

        console.log('[ModuleInstrumentation] 用户指标系统已启动');
      } catch (error) {
        console.error('[ModuleInstrumentation] 启动用户指标系统失败:', error);
      }
    });
    this.app.use(
      async (ctx: Context, next) => {
        await next();
        if (ctx.action) {
          const { actionName, resourceName } = ctx.action;
          if (this.serverTrackingFilter?.check(resourceName, actionName)) {
            const whiteList = this.serverTrackingFilter.whiteList;
            return await handleOtherAction(ctx, next, whiteList);
          }
        }
      },
      { tag: 'trackingConfig', before: 'errorHandler' },
    );
  }

  async load() {
    if (isMainThread) {
      this.addServerTrackingListener();
    }
    this.app.acl.allow('instrumentation', 'create', 'public');
    this.app.acl.allow('instrumentation', ['list', 'query'], 'loggedIn');
    this.app.acl.allow('instrumentation', ['getMetrics', 'getMetricsAsJSON', 'resetMetrics'], 'public');
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.clientTracking`,
      actions: ['trackingEvents:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.trackingConfig`,
      actions: ['trackingConfig:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.trackingStatistics`,
      actions: ['statisticsConfig:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.statisticsDetails`,
      actions: ['instrumentation:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation.statisticsHistorical`,
      actions: ['trackingHistoryOptions:*'],
    });
  }
}

export default ModuleInstrumentationServer;
