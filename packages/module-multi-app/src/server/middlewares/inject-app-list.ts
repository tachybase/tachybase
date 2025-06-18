import { AppSupervisor } from '@tachybase/server';

// 注入 APP 运行状态，替换 tmpl 为 displayName(name) 的格式
export function injectAppListMiddleware() {
  return async (ctx, next) => {
    await next();
    const { actionName, resourceName, params } = ctx.action;
    if (actionName === 'list' && resourceName === 'applications') {
      const applications = ctx.body.rows;
      for (const application of applications) {
        const appStatus = AppSupervisor.getInstance().getAppStatus(application.name, 'stopped');
        application.status = appStatus;
      }
    }
  };
}
