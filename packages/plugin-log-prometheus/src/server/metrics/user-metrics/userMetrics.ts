import client from 'prom-client';

import { register } from '../register';

// 用户登录相关指标
export const userMetrics = {
  // 注册用户总数（仪表盘）
  totalRegisteredUsers: new client.Gauge({
    name: 'tego_user_total_registered',
    help: '注册用户总数',
    registers: [register],
  }),
  // 每日登录人次（计数器）
  dailyLoginCount: new client.Counter({
    name: 'tego_user_daily_login_count',
    help: '每日登录人次统计',
    labelNames: ['date'],
    registers: [register],
  }),

  // 每日有效登录人数（计数器）
  dailyActiveUsers: new client.Gauge({
    name: 'tego_user_daily_active_users',
    help: '每日有效登录人数统计',
    labelNames: ['date'],
    registers: [register],
  }),

  // 当前在线用户数（仪表盘）
  onlineUsers: new client.Gauge({
    name: 'tego_user_online_users',
    help: '当前在线用户数',
    registers: [register],
  }),

  // 登录成功总次数
  loginSuccessCount: new client.Counter({
    name: 'tego_user_login_success_total',
    help: '登录成功总次数',
    labelNames: ['user_id', 'method'],
    registers: [register],
  }),

  // 登录失败总次数
  loginFailureCount: new client.Counter({
    name: 'tego_user_login_failure_total',
    help: '登录失败总次数',
    labelNames: ['reason', 'method'],
    registers: [register],
  }),

  // ===== 新增留存率相关指标 =====

  // 用户注册日期记录（用于计算留存率）
  userRegistrationDate: new client.Gauge({
    name: 'tego_user_registration_timestamp',
    help: '用户注册时间戳',
    labelNames: ['user_id'],
    registers: [register],
  }),

  // 用户每日活跃状态（用于计算留存率）
  userDailyActivity: new client.Gauge({
    name: 'tego_user_daily_activity',
    help: '用户每日活跃状态（1=活跃，0=不活跃）',
    labelNames: ['user_id', 'date'],
    registers: [register],
  }),

  // 用户核心功能操作记录
  userCoreActionCount: new client.Counter({
    name: 'tego_user_core_action_total',
    help: '用户核心功能操作总次数',
    labelNames: ['user_id', 'action_type', 'date'],
    registers: [register],
  }),

  // 留存率计算指标 - 次日留存
  retentionNextDay: new client.Gauge({
    name: 'tego_user_retention_next_day',
    help: '次日留存率（百分比）',
    labelNames: ['date'],
    registers: [register],
  }),

  // 留存率计算指标 - 7日留存
  retention7Day: new client.Gauge({
    name: 'tego_user_retention_7_day',
    help: '7日留存率（百分比）',
    labelNames: ['date'],
    registers: [register],
  }),

  // 留存率计算指标 - 30日留存
  retention30Day: new client.Gauge({
    name: 'tego_user_retention_30_day',
    help: '30日留存率（百分比）',
    labelNames: ['date'],
    registers: [register],
  }),

  // 新增用户数（用于计算留存率分母）
  newUsersCount: new client.Gauge({
    name: 'tego_user_new_users_count',
    help: '每日新增用户数',
    labelNames: ['date'],
    registers: [register],
  }),

  // 留存用户数（用于计算留存率分子）
  retainedUsersCount: new client.Gauge({
    name: 'tego_user_retained_users_count',
    help: '留存用户数',
    labelNames: ['retention_type', 'date'], // retention_type: next_day, 7_day, 30_day
    registers: [register],
  }),
};
