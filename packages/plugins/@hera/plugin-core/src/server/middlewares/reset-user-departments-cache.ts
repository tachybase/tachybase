import type { Context, Next } from '@nocobase/actions';

export const resetUserDepartmentsCache = async (ctx: Context, next: Next) => {
  await next();
  const { associatedName, resourceName, associatedIndex, actionName, values } = ctx.action.params;
  const cache = ctx.app.cache;
  if (
    associatedName === 'departments' &&
    resourceName === 'members' &&
    ['add', 'remove', 'set'].includes(actionName) &&
    (values == null ? void 0 : values.length)
  ) {
    for (const memberId of values) {
      await cache.del(`departments:${memberId}`);
    }
  }
  if (associatedName === 'users' && resourceName === 'departments' && ['add', 'remove', 'set'].includes(actionName)) {
    await cache.del(`departments:${associatedIndex}`);
  }
};
