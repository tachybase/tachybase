import type { Context, Next } from '@tachybase/actions';

const destroyCheck = async (ctx: Context) => {
  const { filterByTk } = ctx.action.params;
  const repo = ctx.db.getRepository('departments');
  const children = await repo.count({
    filter: {
      parentId: filterByTk,
    },
  });
  if (children) {
    ctx.throw(400, ctx.t('The department has sub-departments, please delete them first', { ns: 'departments' }));
  }
  const members = await ctx.db.getRepository('departmentsUsers').count({
    filter: {
      departmentId: filterByTk,
    },
  });
  if (members) {
    ctx.throw(400, ctx.t('The department has members, please remove them first', { ns: 'departments' }));
  }
};
export const destroyDepartmentCheck = async (ctx: Context, next: Next) => {
  const { resourceName, actionName } = ctx.action.params;
  if (resourceName === 'departments' && actionName === 'destroy') {
    await destroyCheck(ctx);
  }
  await next();
};
