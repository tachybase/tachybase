import { isMainThread } from 'node:worker_threads';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { MetricsController } from './actions/metrics-controller';
import { TrackingController } from './actions/tracking-controller';
import { TrackingFilter } from './metrics/tracking-filter';
import { createUserMetricsMiddleware, initializeUserMetrics } from './metrics/user-metrics';
import { createTrackingMiddleware, initializeDefaultTrackingConfig } from './middlewares/tracking-middleware';

// 注册控制器
@InjectedPlugin({
  Controllers: [MetricsController, TrackingController],
})
export class PluginLogMetricsServer extends Plugin {
  private trackingFilter: TrackingFilter = null;

  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    // 设置权限
    this.app.acl.allow('log-metrics', ['getMetrics', 'getMetricsAsJSON', 'resetMetrics'], 'public');
    this.app.acl.allow(
      'log-metrics',
      ['getTrackingMetrics', 'getTrackingMetricsAsJSON', 'resetTrackingMetrics'],
      'public',
    );
    this.app.acl.allow(
      'log-metrics',
      [
        'getTrackingConfigs',
        'getTrackingStats',
        'createTrackingConfig',
        'updateTrackingConfig',
        'deleteTrackingConfig',
      ],
      'loggedIn',
    );

    // 注册权限片段
    this.app.acl.registerSnippet({
      name: `pm.system-services.log-metrics.tracking`,
      actions: ['log-metrics:*'],
    });

    // 只在主线程初始化追踪功能
    if (isMainThread) {
      await this.initializeTrackingSystem();
    }

    // 初始化用户指标系统
    try {
      const { userMetrics, statsCollector } = await initializeUserMetrics(this.db, true);

      // 添加用户指标中间件
      this.app.use(createUserMetricsMiddleware(userMetrics), {
        tag: 'userMetrics',
        before: 'errorHandler',
      });
    } catch (error) {
      console.error('[PluginLogMetrics] 启动用户指标系统失败:', error);
    }
  }

  // 初始化追踪系统
  async initializeTrackingSystem() {
    try {
      console.log('[PluginLogMetrics] 初始化追踪系统...');

      // 初始化默认追踪配置
      await initializeDefaultTrackingConfig(this.db);

      // 创建追踪过滤器
      this.trackingFilter = new TrackingFilter(this.db);

      // 等待追踪过滤器加载完成
      await this.trackingFilter.load();

      // 设置追踪控制器
      const trackingController = this.app.controllers.find(
        (controller) => controller.constructor.name === 'TrackingController',
      );
      if (trackingController && 'setTrackingFilter' in trackingController) {
        (trackingController as any).setTrackingFilter(this.trackingFilter);
      }

      // 添加追踪中间件
      this.app.use(createTrackingMiddleware(this.trackingFilter), {
        tag: 'tracking',
        before: 'errorHandler',
      });

      console.log('[PluginLogMetrics] 追踪系统初始化完成');
    } catch (error) {
      console.error('[PluginLogMetrics] 初始化追踪系统失败:', error);
    }
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginLogMetricsServer;
