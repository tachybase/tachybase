import { formatDateTime } from '@tachybase/utils';

import { register } from '../register';
import { userMetrics } from './userMetrics';

// 工具函数
export const metricsUtils = {
  // 记录登录成功
  recordLoginSuccess(userId: string, method: string = 'password') {
    userMetrics.loginSuccessCount.inc({
      user_id: userId,
      method,
    });
    this.updateDailyLoginCount();
  },

  // 记录登录失败
  recordLoginFailure(reason: string, method: string = 'password') {
    userMetrics.loginFailureCount.inc({
      reason,
      method,
    });
  },

  // 更新每日登录人次
  updateDailyLoginCount() {
    const today = formatDateTime(new Date(), 'YYYY-MM-DD');
    userMetrics.dailyLoginCount.inc({
      date: today,
    });
  },

  // 设置每日有效登录用户数
  setDailyActiveUsers(count: number) {
    const today = formatDateTime(new Date(), 'YYYY-MM-DD');
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
