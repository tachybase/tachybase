import client from 'prom-client';

import { register } from './register';

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
