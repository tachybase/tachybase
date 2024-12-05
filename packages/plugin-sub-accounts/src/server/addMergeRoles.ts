import Application from '@tachybase/server';

import { MergeRoleModel } from './model/MergeRoleModel';

/**
 * 启动插件后给所有未设置selfRole的用户设置selfRole
 */
export async function addMergeRole(app: Application) {
  const userRepo = app.db.getRepository('users');
  const missingUsers = await userRepo.find({
    fields: ['id', 'roles'],
    filter: {
      'selfRole.name': null,
    },
    appends: ['roles'],
  });
  const roleRepo = app.db.getRepository('roles');
  for (const missingUser of missingUsers) {
    const mergeRole = {
      title: `{{${missingUser.id} + '_' + t("All")}}`,
      name: `m_${missingUser.id}`,
      ownerUserId: missingUser.id,
    };
    // 创建新的个人专属mergeRole
    const mergeRoleModel = (await roleRepo.create({ values: mergeRole })) as MergeRoleModel;
  }
  app.logger.info(`[acl] add mergeRoles for ${missingUsers.length} users`);
}
