import { DestroyOptions } from '@tachybase/database';
import { Application } from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

/**
 * 原始角色变化会导致合成角色也发生变化
 */
export async function sourceRoleDestroy(model: MergeRoleModel, options: DestroyOptions) {
  if (model.ownerUserId) {
    return;
  }
  const { transaction } = options;
  const affectedUsers = await model.db.getRepository('users').find({
    filter: {
      'roles.name': model.name,
    },
    appends: ['selfRole'],
  });
  if (!affectedUsers.length) {
    return;
  }
  const affectedRoles = affectedUsers.map((u) => u.selfRole) as MergeRoleModel[];
  const acl = (this as Application).acl;
  for (const affectedRole of affectedRoles) {
    await affectedRole.resetAcl({ transaction, acl });
  }
}
