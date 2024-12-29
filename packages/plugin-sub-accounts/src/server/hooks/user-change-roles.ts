import { UpdateOptions } from '@tachybase/database';
import { Application } from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

/**
 * 用户新增/删除/设置 角色
 * @param model
 * @param options
 * @returns
 */
export async function userChangeRoles(app: Application, model: MergeRoleModel, options: UpdateOptions) {
  // 没有发生角色变化,不调用这个钩子
  if (model.dataValues.roles === undefined) {
    return;
  }

  const rolesBefore = (await model.getRoles()) as MergeRoleModel[];
  const rolesNameBefore = rolesBefore.map((role) => role.name);
  const rolesNameAfter = model.dataValues.roles || ([] as string[]);
  let changed = false;
  if (rolesNameBefore.length !== rolesNameAfter.length) {
    changed = true;
  } else {
    for (const role of rolesNameAfter) {
      if (!rolesNameBefore.includes(role)) {
        changed = true;
        break;
      }
    }
  }
  if (!changed) {
    return;
  }
  const { transaction } = options;
  const selfRole = (await model.getSelfRole({ transaction })) as MergeRoleModel;
  if (selfRole) {
    await selfRole.resetAcl({ transaction, app });
    await selfRole.refreshDataSourcesAcl({ transaction, app });
  }
}
