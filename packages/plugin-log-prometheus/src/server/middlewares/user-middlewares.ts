import { UserLoginMetrics } from '../metrics/user-metrics/metricsManager';

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
