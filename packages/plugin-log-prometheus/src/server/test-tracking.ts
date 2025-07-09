// 简单的追踪功能测试
// 这个文件用于验证追踪功能是否正常工作

import { trackingMetricsUtils } from './metrics';
import { TrackingFilter } from './tracking-filter';

// 模拟测试数据
const mockConfig = {
  title: 'test-action',
  resourceName: 'test',
  action: 'create',
  enabled: true,
  trackingOptions: {
    meta: ['userId', 'createdAt'],
    payload: ['name', 'email'],
    filter: {},
  },
};

// 测试追踪指标记录
export async function testTrackingMetrics() {
  console.log('[Test] 开始测试追踪指标...');

  try {
    // 测试记录操作执行
    trackingMetricsUtils.recordActionExecution(
      mockConfig,
      'success',
      150, // 150ms
      'user123',
      undefined,
    );

    // 测试记录错误操作
    trackingMetricsUtils.recordActionExecution(
      mockConfig,
      'error',
      500, // 500ms
      'user123',
      'ValidationError',
    );

    // 测试批量操作
    trackingMetricsUtils.recordBatchAction(mockConfig, 10, 'success');

    // 测试配置计数
    trackingMetricsUtils.updateTrackingConfigCount(5, 10);

    console.log('[Test] 追踪指标测试完成');

    // 获取指标数据
    const metrics = await trackingMetricsUtils.getTrackingMetrics();
    console.log('[Test] 当前指标数据长度:', metrics.length);
  } catch (error) {
    console.error('[Test] 追踪指标测试失败:', error);
  }
}

// 测试追踪过滤器
export async function testTrackingFilter(db: any) {
  console.log('[Test] 开始测试追踪过滤器...');

  try {
    const filter = new TrackingFilter(db);
    await filter.load();

    // 测试检查功能
    const shouldTrack = filter.check('auth', 'signIn');
    console.log('[Test] 是否应该追踪 auth:signIn:', shouldTrack);

    // 测试获取配置
    const config = filter.getConfig('auth', 'signIn');
    console.log('[Test] 获取到的配置:', config ? config.title : '未找到');

    // 测试获取所有启用配置
    const enabledConfigs = filter.getEnabledConfigs();
    console.log('[Test] 启用配置数量:', enabledConfigs.length);

    console.log('[Test] 追踪过滤器测试完成');
  } catch (error) {
    console.error('[Test] 追踪过滤器测试失败:', error);
  }
}

// 导出测试函数
export default {
  testTrackingMetrics,
  testTrackingFilter,
};
