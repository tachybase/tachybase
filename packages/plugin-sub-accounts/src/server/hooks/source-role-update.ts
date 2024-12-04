import { UpdateOptions } from '@tachybase/database';
import { Application } from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

// 那些字段发生变化需要resetAcl
const observeFields = ['snippets', 'allowNewMenu'] as string[];

/**
 * 原始角色变化会导致合成角色也发生变化
 */
export async function sourceRoleUpdate(model: MergeRoleModel, options: UpdateOptions) {
  if (model.ownerUserId) {
    return;
  }
  let newResetAcl = false;
  for (const field of options.fields) {
    if (observeFields.includes(field as string)) {
      newResetAcl = true;
      break;
    }
  }
  if (!newResetAcl) {
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
    await affectedRole.resetAcl({ transaction, acl, changedFields: options.fields as string[] });
  }
}
