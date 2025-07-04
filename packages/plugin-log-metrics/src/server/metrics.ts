import client from 'prom-client';

// 创建 Prometheus 注册表
const register = new client.Registry();

// 添加默认指标收集器
client.collectDefaultMetrics({
  register,
});

// 用户登录相关指标
export const userMetrics = {
  // 每日登录人次（计数器）
  dailyLoginCount: new client.Counter({
    name: 'tachybase_user_daily_login_count',
    help: '每日登录人次统计',
    labelNames: ['date'],
    registers: [register],
  }),

  // 每日有效登录人数（仪表盘）
  dailyActiveUsers: new client.Gauge({
    name: 'tachybase_user_daily_active_users',
    help: '每日有效登录人数统计',
    labelNames: ['date'],
    registers: [register],
  }),

  // 注册用户总数（仪表盘）
  totalRegisteredUsers: new client.Gauge({
    name: 'tachybase_user_total_registered',
    help: '注册用户总数',
    registers: [register],
  }),

  // 登录成功次数
  loginSuccessCount: new client.Counter({
    name: 'tachybase_user_login_success_total',
    help: '登录成功总次数',
    labelNames: ['user_id', 'method'],
    registers: [register],
  }),

  // 登录失败次数
  loginFailureCount: new client.Counter({
    name: 'tachybase_user_login_failure_total',
    help: '登录失败总次数',
    labelNames: ['reason', 'method'],
    registers: [register],
  }),
};

// 追踪相关指标
export const trackingMetrics = {
  // 操作执行次数（按配置分组）
  actionExecutionCount: new client.Counter({
    name: 'tachybase_action_execution_total',
    help: '操作执行总次数',
    labelNames: ['config_title', 'resource_name', 'action_name', 'status'],
    registers: [register],
  }),

  // 操作执行时长（直方图）
  actionExecutionDuration: new client.Histogram({
    name: 'tachybase_action_execution_duration_seconds',
    help: '操作执行时长（秒）',
    labelNames: ['config_title', 'resource_name', 'action_name'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
    registers: [register],
  }),

  // 用户操作频率（按用户分组）
  userActionFrequency: new client.Counter({
    name: 'tachybase_user_action_total',
    help: '用户操作总次数',
    labelNames: ['user_id', 'config_title', 'resource_name', 'action_name'],
    registers: [register],
  }),

  // 错误操作次数
  errorActionCount: new client.Counter({
    name: 'tachybase_action_error_total',
    help: '操作错误总次数',
    labelNames: ['config_title', 'resource_name', 'action_name', 'error_type'],
    registers: [register],
  }),

  // 追踪配置数量
  trackingConfigCount: new client.Gauge({
    name: 'tachybase_tracking_config_total',
    help: '追踪配置总数',
    labelNames: ['status'],
    registers: [register],
  }),
};

// 工具函数
export const metricsUtils = {
  // 记录登录成功
  recordLoginSuccess(userId: string, method: string = 'password') {
    userMetrics.loginSuccessCount.inc({ user_id: userId, method });
    this.updateDailyLoginCount();
  },

  // 记录登录失败
  recordLoginFailure(reason: string, method: string = 'password') {
    userMetrics.loginFailureCount.inc({ reason, method });
  },

  // 更新每日登录人次
  updateDailyLoginCount() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 格式
    userMetrics.dailyLoginCount.inc({ date: today });
  },

  // 设置每日活跃用户数
  setDailyActiveUsers(count: number) {
    const today = new Date().toISOString().split('T')[0];
    userMetrics.dailyActiveUsers.set({ date: today }, count);
  },

  // 设置注册用户总数
  setTotalRegisteredUsers(count: number) {
    userMetrics.totalRegisteredUsers.set(count);
  },

  // 获取指标数据
  async getMetrics(): Promise<string> {
    return await register.metrics();
  },

  // 获取 JSON 格式的指标数据
  async getMetricsAsJSON(): Promise<any> {
    return await register.getMetricsAsJSON();
  },

  // 重置所有指标
  resetAllMetrics(): void {
    register.clear();
  },
};

// 追踪指标工具类
export class TrackingMetricsUtils {
  private static instance: TrackingMetricsUtils;

  static getInstance(): TrackingMetricsUtils {
    if (!TrackingMetricsUtils.instance) {
      TrackingMetricsUtils.instance = new TrackingMetricsUtils();
    }
    return TrackingMetricsUtils.instance;
  }

  // 更新追踪配置计数
  updateTrackingConfigCount(enabledCount: number, totalCount: number) {
    trackingMetrics.trackingConfigCount.set({ status: 'enabled' }, enabledCount);
    trackingMetrics.trackingConfigCount.set({ status: 'total' }, totalCount);
  }

  // 记录操作执行
  recordActionExecution(
    config: any,
    status: 'success' | 'error' = 'success',
    duration?: number,
    userId?: string,
    errorType?: string,
  ) {
    const labels = {
      config_title: config.title,
      resource_name: config.resourceName,
      action_name: config.action,
      status,
    };

    // 记录执行次数
    trackingMetrics.actionExecutionCount.inc(labels);

    // 记录执行时长
    if (duration !== undefined) {
      trackingMetrics.actionExecutionDuration.observe(
        {
          config_title: config.title,
          resource_name: config.resourceName,
          action_name: config.action,
        },
        duration / 1000, // 转换为秒
      );
    }

    // 记录用户操作
    if (userId) {
      trackingMetrics.userActionFrequency.inc({
        user_id: userId,
        config_title: config.title,
        resource_name: config.resourceName,
        action_name: config.action,
      });
    }

    // 记录错误
    if (status === 'error' && errorType) {
      trackingMetrics.errorActionCount.inc({
        config_title: config.title,
        resource_name: config.resourceName,
        action_name: config.action,
        error_type: errorType,
      });
    }
  }

  // 记录批量操作
  recordBatchAction(config: any, count: number, status: 'success' | 'error' = 'success') {
    const labels = {
      config_title: config.title,
      resource_name: config.resourceName,
      action_name: config.action,
      status,
    };

    // 批量增加计数
    trackingMetrics.actionExecutionCount.inc(labels, count);
  }

  // 获取所有追踪指标
  async getTrackingMetrics(): Promise<string> {
    return await register.metrics();
  }

  // 获取追踪指标的 JSON 格式
  async getTrackingMetricsAsJSON(): Promise<any> {
    return await register.getMetricsAsJSON();
  }

  // 重置追踪指标
  resetTrackingMetrics(): void {
    register.clear();
  }
}

// 导出工具实例
export const trackingMetricsUtils = TrackingMetricsUtils.getInstance();

// 导出注册表
export { register };

// 默认导出
export default {
  userMetrics,
  trackingMetrics,
  metricsUtils,
  trackingMetricsUtils,
  register,
};
