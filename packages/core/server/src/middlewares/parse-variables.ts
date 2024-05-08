import { getDateVars, parseFilter } from '@tachybase/utils';

function getUser(ctx) {
  return async ({ fields }) => {
    const userFields = fields.filter((f) => f && ctx.db.getFieldByPath('users.' + f));
    ctx.logger?.info('filter-parse: ', { userFields });
    if (!ctx.state.currentUser) {
      return;
    }
    if (!userFields.length) {
      return;
    }
    const user = await ctx.db.getRepository('users').findOne({
      filterByTk: ctx.state.currentUser.id,
      fields: userFields,
    });
    ctx.logger?.info('filter-parse: ', {
      $user: user?.toJSON(),
    });
    return user;
  };
}

function isNumeric(str: any) {
  if (typeof str === 'number') return true;
  if (typeof str != 'string') return false;
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}

export const parseVariables = async (ctx, next) => {
  const filter = ctx.action.params.filter;
  if (!filter) {
    return next();
  }
  ctx.action.params.filter = await parseFilter(filter, {
    timezone: ctx.get('x-timezone'),
    now: new Date().toISOString(),
    getField: (path) => {
      const fieldPath = path
        .split('.')
        .filter((p) => !p.startsWith('$') && !isNumeric(p))
        .join('.');
      const { resourceName } = ctx.action;
      return ctx.db.getFieldByPath(`${resourceName}.${fieldPath}`);
    },
    vars: {
      // @deprecated
      $system: {
        now: new Date().toISOString(),
      },
      // @deprecated
      $date: getDateVars(),
      // 新的命名方式，防止和 formily 内置变量冲突
      $nDate: getDateVars(),
      $user: getUser(ctx),
      $nRole: ctx.state.currentRole,
    },
  });
  await next();
};
