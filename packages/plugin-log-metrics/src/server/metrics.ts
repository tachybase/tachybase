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

// 导出注册表
export { register };

// 默认导出
export default {
  userMetrics,
  metricsUtils,
  register,
};
