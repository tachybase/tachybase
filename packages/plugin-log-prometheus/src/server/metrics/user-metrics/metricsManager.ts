import { convertUTCToLocal } from '@tachybase/utils';

import { metricsUtils } from './metricsUtils';

/**
 * 用户登录指标管理类
 * 负责记录和管理用户登录相关的指标数据
 */
export class UserLoginMetrics {
  private db: any;

  constructor(db?: any) {
    this.db = db;
  }

  /**
   * 记录用户登录成功
   * @param userId 用户ID
   * @param method 登录方式
   */
  async recordUserLogin(userId: string, method: string = 'password') {
    try {
      metricsUtils.recordLoginSuccess(userId, method);
      console.log(`[UserMetrics] 用户登录成功: ${userId}, 方式: ${method}`);
    } catch (error) {
      console.error('[UserMetrics] 记录用户登录失败:', error);
    }
  }

  /**
   * 记录用户登录失败
   * @param reason 失败原因
   * @param method 登录方式
   */
  async recordUserLoginFailure(reason: string, method: string = 'password') {
    try {
      metricsUtils.recordLoginFailure(reason, method);
      console.log(`[UserMetrics] 用户登录失败: ${reason}, 方式: ${method}`);
    } catch (error) {
      console.error('[UserMetrics] 记录用户登录失败:', error);
    }
  }

  /**
   * 更新每日活跃用户数
   * @param userId 活跃用户ID
   */
  async updateDailyActiveUsers(userId: string) {
    try {
      metricsUtils.updateDailyActiveUsersCount(userId);
      console.log(`[UserMetrics] 更新每日活跃用户数: ${userId}`);
    } catch (error) {
      console.error('[UserMetrics] 更新每日活跃用户数失败:', error);
    }
  }

  /**
   * 更新注册用户总数
   * @param count 注册用户总数
   */
  async updateTotalRegisteredUsers(count: number) {
    try {
      metricsUtils.setTotalRegisteredUsers(count);
      console.log(`[UserMetrics] 更新注册用户总数: ${count}`);
    } catch (error) {
      console.error('[UserMetrics] 更新注册用户总数失败:', error);
    }
  }

  /**
   * 从数据库获取每日活跃用户数
   */
  async getDailyActiveUsersFromDB(): Promise<number> {
    if (!this.db) {
      console.warn('[UserMetrics] 数据库未初始化，返回默认值');
      return 0;
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 查询今日登录的用户数量（去重）
      const activeUsers = await this.db.getRepository('users').count({
        filter: {
          lastSignInAt: {
            $gte: today.toISOString(),
            $lt: tomorrow.toISOString(),
          },
        },
      });

      return activeUsers;
    } catch (error) {
      console.error('[UserMetrics] 获取每日活跃用户数失败:', error);
      return 0;
    }
  }

  /**
   * 从数据库获取注册用户总数
   */
  async getTotalRegisteredUsersFromDB(): Promise<number> {
    if (!this.db) {
      console.warn('[UserMetrics] 数据库未初始化，返回默认值');
      return 0;
    }

    try {
      const totalUsers = await this.db.getRepository('users').count();
      return totalUsers;
    } catch (error) {
      console.error('[UserMetrics] 获取注册用户总数失败:', error);
      return 0;
    }
  }
}

/**
 * 用户统计数据收集器
 * 定期从数据库收集用户统计数据并更新指标
 */
export class UserStatsCollector {
  private interval: NodeJS.Timeout | null = null;
  private userMetrics: UserLoginMetrics;
  private isRunning: boolean = false;

  constructor(userMetrics: UserLoginMetrics) {
    this.userMetrics = userMetrics;
  }

  /**
   * 启动统计数据收集
   * @param intervalMs 收集间隔（毫秒）
   */
  start(intervalMs: number = 3600000) {
    // 默认每小时收集一次
    if (this.isRunning) {
      console.warn('[UserStatsCollector] 统计数据收集器已在运行');
      return;
    }

    this.isRunning = true;
    this.interval = setInterval(async () => {
      await this.collectUserStats();
    }, intervalMs);

    console.log(`[UserStatsCollector] 用户统计数据收集器已启动，间隔: ${intervalMs / 1000 / 60} 分钟`);

    // 立即执行一次
    this.collectUserStats();
  }

  /**
   * 停止统计数据收集
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('[UserStatsCollector] 用户统计数据收集器已停止');
  }

  /**
   * 收集用户统计数据
   */
  private async collectUserStats() {
    try {
      console.log('[UserStatsCollector] 开始收集用户统计数据...');

      // 从数据库获取实际数据
      const dailyActiveUsers = await this.userMetrics.getDailyActiveUsersFromDB();
      const totalRegisteredUsers = await this.userMetrics.getTotalRegisteredUsersFromDB();

      // 更新指标
      await this.userMetrics.updateDailyActiveUsers();
      await this.userMetrics.updateTotalRegisteredUsers(totalRegisteredUsers);

      console.log(
        `[UserStatsCollector] 用户统计数据已更新: 活跃用户 ${dailyActiveUsers}, 注册用户 ${totalRegisteredUsers}`,
      );
    } catch (error) {
      console.error('[UserStatsCollector] 收集用户统计数据失败:', error);
    }
  }

  /**
   * 检查是否正在运行
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

/**
 * 创建用户指标中间件
 * 自动检测登录请求并记录相关指标
 */
export function createUserMetricsMiddleware(userMetrics: UserLoginMetrics) {
  return async (ctx: any, next: () => Promise<any>) => {
    const startTime = Date.now();

    try {
      await next();

      const duration = (Date.now() - startTime) / 1000; // 转换为秒

      // 检测登录相关的请求
      if (ctx.action && ctx.action.actionName === 'signIn') {
        if (ctx.status === 200 || !ctx.body?.errors) {
          // 登录成功
          const userId = ctx.auth?.user?.id || ctx.action.params?.values?.account || 'unknown';
          await userMetrics.recordUserLogin(userId, 'password');
        } else {
          // 登录失败
          const reason = ctx.body?.errors?.[0]?.message || 'server_error';
          await userMetrics.recordUserLoginFailure(reason, 'password');
        }
      }

      // 记录请求日志（可选）
      if (process.env.NODE_ENV === 'development') {
        console.log(`[HTTP] ${ctx.action?.actionName || 'unknown'} - ${ctx.status || 200} (${duration.toFixed(2)}s)`);
      }
    } catch (error) {
      // 如果登录失败，记录错误
      if (ctx.action && ctx.action.actionName === 'signIn') {
        await userMetrics.recordUserLoginFailure('server_error', 'password');
      }
      throw error;
    }
  };
}

/**
 * 初始化用户指标系统
 * @param db 数据库实例
 * @param autoStart 是否自动启动统计数据收集
 */
export async function initializeUserMetrics(db?: any, autoStart: boolean = true) {
  try {
    console.log('[UserMetrics] 初始化用户指标系统...');

    const userMetrics = new UserLoginMetrics(db);
    const statsCollector = new UserStatsCollector(userMetrics);

    if (autoStart) {
      statsCollector.start();
    }

    console.log('[UserMetrics] 用户指标系统初始化完成');

    return {
      userMetrics,
      statsCollector,
    };
  } catch (error) {
    console.error('[UserMetrics] 初始化用户指标系统失败:', error);
    throw error;
  }
}

// 导出主要功能
export const userLoginMetrics = new UserLoginMetrics();
