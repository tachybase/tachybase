import { Context } from '@tachybase/actions';

import { MergeRoleModel } from '../model/MergeRoleModel';

/**
 * 在角色列表中增加、删除、设置用户角色时，重置用户的自身合并角色
 * 在角色列表中增加、删除、设置菜单项，重置用户的自身合并角色
 * @param ctx
 * @param next
 */
export async function changeUserRolesMiddleware(ctx: Context, next) {
  await next();
  const { associatedName, resourceName, actionName, values, associatedIndex } = ctx.action.params;
  if (
    associatedName === 'roles' &&
    resourceName === 'users' &&
    ['add', 'remove', 'set'].includes(actionName) &&
    values?.length
  ) {
    /**
     * 在角色列表中增加、删除、设置用户角色时，重置用户的自身合并角色
     */
    const userRepo = ctx.db.getRepository('users');
    const userList = await userRepo.find({
      fields: ['id'],
      filter: {
        id: { $in: values },
      },
      appends: ['selfRole'],
    });
    const userMap = userList.reduce((map, user) => {
      map.set(user.id, user);
      return map;
    }, new Map());
    for (const userId of values) {
      const user = userMap.get(userId);
      const selfRole = user.selfRole as MergeRoleModel;
      if (!selfRole) {
        continue;
      }
      await selfRole.resetAcl({ app: ctx.app });
    }
  } else if (
    associatedName === 'roles' &&
    resourceName === 'menuUiSchemas' &&
    ['add', 'remove', 'set'].includes(actionName)
  ) {
    /**
     * 修改了用户的菜单权限，重置用户的自身合并角色
     */
    const affectedUsers = await ctx.db.getRepository('users').find({
      filter: {
        'roles.name': associatedIndex,
      },
      appends: ['selfRole'],
    });
    if (!affectedUsers.length) {
      return;
    }

    const affectedRoles = affectedUsers.map((u) => u.selfRole) as MergeRoleModel[];
    for (const affectedRole of affectedRoles) {
      await affectedRole.resetAcl({ app: ctx.app, changedFields: ['menuUiSchemas'] });
    }
  }
}
