import Application from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

/**
 * 启动时，给所有合并角色装载数据源权限
 */
export async function refreshDataSourcesAclAtAppStart() {
  const app = this as Application;
  const exists = await app.db.collectionExistsInDb('dataSourcesRoles');
  if (!exists) {
    // 倘若data-source-manager插件未启用，不需要执行
    return;
  }
  const roles = (await app.db.getRepository('roles').find({
    filter: { ownerUserId: { $ne: null } },
  })) as MergeRoleModel[];

  for (const role of roles) {
    await role.refreshDataSourcesAcl({ app });
  }

  app.logger.info('[acl] refreshDataSourcesAclAtAppStart done');
}
