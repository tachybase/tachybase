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

  // ===== 新增留存率相关工具函数 =====

  // 记录用户注册
  recordUserRegistration(userId: string, registrationDate: Date) {
    const timestamp = registrationDate.getTime() / 1000; // 转换为秒
    userMetrics.userRegistrationDate.set({ user_id: userId }, timestamp);

    // 记录新增用户数
    const date = formatDateTime(registrationDate, 'YYYY-MM-DD');
    userMetrics.newUsersCount.inc({ date });

    console.log(`[UserMetrics] 记录用户注册: ${userId}, 日期: ${date}`);
  },

  // 记录用户每日活跃状态
  recordUserDailyActivity(userId: string, date: string, isActive: boolean) {
    const value = isActive ? 1 : 0;
    userMetrics.userDailyActivity.set({ user_id: userId, date }, value);
  },

  // 记录用户核心功能操作
  recordUserCoreAction(userId: string, actionType: string) {
    const today = formatDateTime(new Date(), 'YYYY-MM-DD');
    userMetrics.userCoreActionCount.inc({
      user_id: userId,
      action_type: actionType,
      date: today,
    });
  },

  // 计算并更新留存率
  updateRetentionRates(date: string) {
    // 这里需要从数据库获取数据来计算留存率
    // 实际实现需要在 metricsManager 中完成
    console.log(`[UserMetrics] 更新留存率: ${date}`);
  },

  // 设置留存率指标
  setRetentionRate(retentionType: 'next_day' | '7_day' | '30_day', date: string, rate: number) {
    const metric =
      retentionType === 'next_day'
        ? userMetrics.retentionNextDay
        : retentionType === '7_day'
          ? userMetrics.retention7Day
          : userMetrics.retention30Day;

    metric.set({ date }, rate);
  },

  // 设置留存用户数
  setRetainedUsersCount(retentionType: 'next_day' | '7_day' | '30_day', date: string, count: number) {
    userMetrics.retainedUsersCount.set({ retention_type: retentionType, date }, count);
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
