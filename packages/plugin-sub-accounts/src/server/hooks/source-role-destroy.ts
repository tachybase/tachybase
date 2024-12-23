import { DestroyOptions } from '@tachybase/database';
import { Application } from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

/**
 * 原始角色变化会导致合成角色也发生变化
 */
export async function sourceRoleDestroy(app: Application, model: MergeRoleModel, options: DestroyOptions) {
  if (model.ownerUserId) {
    return;
  }
  const { transaction } = options;
  const rolesUsers = await model.db.getRepository('users').find({
    filter: {
      'roles.name': model.name,
    },
    appends: ['selfRole'],
  });

  // 加入部门里的用户
  const members = await model.getMembersByDepartment(transaction);
  const memberMap = new Map();
  for (const member of members) {
    memberMap.set(member.id, member);
  }
  for (const user of rolesUsers) {
    memberMap.set(user.id, user);
  }
  const affectedUsers = Array.from(memberMap.values());

  if (!affectedUsers.length) {
    return;
  }
  const affectedRoles = affectedUsers.map((u) => u.selfRole) as MergeRoleModel[];
  for (const affectedRole of affectedRoles) {
    await affectedRole.resetAcl({ transaction, app });
    await affectedRole.refreshDataSourcesAcl({ transaction, app });
  }
}
