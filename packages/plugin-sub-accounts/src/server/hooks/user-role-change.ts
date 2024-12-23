import { UpdateOptions } from '@tachybase/database';
import { Application } from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

/**
 * 用户新增/删除/设置 角色
 * @param model
 * @param options
 * @returns
 */
export async function userRoleChange(app: Application, userId: number, options: UpdateOptions) {
  const { transaction } = options;
  // 使用 include 在一次查询中获取用户及其角色
  const user = await app.db.getModel('users').findByPk(userId, {
    include: [
      {
        association: 'selfRole',
        required: false,
      },
    ],
    transaction,
  });
  const selfRole = user?.get('selfRole') as MergeRoleModel;
  if (selfRole) {
    await selfRole.resetAcl({ transaction, app });
    await selfRole.refreshDataSourcesAcl({ transaction, app });
  }
}
