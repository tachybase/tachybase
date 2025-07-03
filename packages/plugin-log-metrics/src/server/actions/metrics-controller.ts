import { Context } from '@tachybase/actions';
import { Controller } from '@tachybase/utils';

import { metricsUtils } from '../metrics';

@Controller('log-metrics')
export class MetricsController {
  // 获取 Prometheus 格式的指标数据
  async getMetrics(ctx: Context, next: () => Promise<any>) {
    try {
      const metrics = await metricsUtils.getMetrics();
      ctx.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      ctx.body = metrics;
    } catch (error) {
      console.error('Failed to get metrics:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get metrics' };
    }
    return next();
  }

  // 获取 JSON 格式的指标数据
  async getMetricsAsJSON(ctx: Context, next: () => Promise<any>) {
    try {
      const metrics = await metricsUtils.getMetricsAsJSON();
      ctx.body = metrics;
    } catch (error) {
      console.error('Failed to get metrics as JSON:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get metrics as JSON' };
    }
    return next();
  }

  // 重置所有指标
  async resetMetrics(ctx: Context, next: () => Promise<any>) {
    try {
      metricsUtils.resetAllMetrics();
      ctx.body = { message: 'Metrics reset successfully' };
    } catch (error) {
      console.error('Failed to reset metrics:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to reset metrics' };
    }
    return next();
  }
}
