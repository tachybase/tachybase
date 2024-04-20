import type { Context, Next } from '@nocobase/actions';
import _ from 'lodash';

const setOwners = async (ctx: Context, filterByTk, owners) => {
  const throughRepo = ctx.db.getRepository('departmentsUsers');
  await ctx.db.sequelize.transaction(async (t) => {
    await throughRepo.update({
      filter: {
        departmentId: filterByTk,
      },
      values: {
        isOwner: false,
      },
      transaction: t,
    });
    await throughRepo.update({
      filter: {
        departmentId: filterByTk,
        userId: {
          $in: owners.map((owner) => owner.id),
        },
      },
      values: {
        isOwner: true,
      },
      transaction: t,
    });
  });
};
export const setDepartmentOwners = async (ctx: Context, next: Next) => {
  const { filterByTk, values = {}, resourceName, actionName } = ctx.action.params;
  const { owners } = values;
  if (resourceName === 'departments' && actionName === 'update' && owners) {
    ctx.action.params.values = _.omit(values, ['owners']);
    await next();
    await setOwners(ctx, filterByTk, owners);
  } else {
    return next();
  }
};
