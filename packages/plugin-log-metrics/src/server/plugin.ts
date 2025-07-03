import { InjectedPlugin, Plugin } from '@tachybase/server';

import { MetricsController } from './actions/metrics-controller';
import { createUserMetricsMiddleware, initializeUserMetrics } from './user-metrics';

// 注册控制器
@InjectedPlugin({
  Controllers: [MetricsController],
})
export class PluginLogMetricsServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    // 设置权限
    this.app.acl.allow('log-metrics', ['getMetrics', 'getMetricsAsJSON', 'resetMetrics'], 'public');

    // 初始化用户指标系统
    try {
      const { userMetrics, statsCollector } = await initializeUserMetrics(this.db, true);

      // 添加用户指标中间件
      this.app.use(createUserMetricsMiddleware(userMetrics), {
        tag: 'userMetrics',
        before: 'errorHandler',
      });

      console.log('[PluginLogMetrics] 用户指标系统已启动');
    } catch (error) {
      console.error('[PluginLogMetrics] 启动用户指标系统失败:', error);
    }
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginLogMetricsServer;
