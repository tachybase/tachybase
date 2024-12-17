import { Plugin } from '@tachybase/server';

import { addMergeRole } from './addMergeRoles';
import {
  mergeRoleCreate,
  refreshDataSourcesAclAtAppStart,
  sourceRoleDestroy,
  sourceRoleUpdate,
  userChangeRoles,
} from './hooks';
import { createMergeRole } from './hooks/user-create';
import { changeUserRolesMiddleware } from './middlewares/change-user-roles';
import { setSelfRole } from './middlewares/set-self-role';
import { MergeRoleModel } from './model/MergeRoleModel';

export class PluginSubAccountsServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {
    // this.app.on('afterStart', addMergeRole.bind(null, this.app));
    // 用新的RoleModel子类覆盖掉原来的
    this.app.db.registerModels({
      RoleModel: MergeRoleModel,
    });
    this.app.on('dataSourceAfterStart', async () => {
      await addMergeRole(this.app);
      refreshDataSourcesAclAtAppStart.bind(this.app)();
    });

    this.app.db.on('roles.afterUpdate', sourceRoleUpdate.bind(this.app));
    this.app.db.on('roles.afterDestroy', sourceRoleDestroy.bind(this.app));
    this.app.db.on('roles.afterCreate', mergeRoleCreate.bind(this.app));

    // 新建用户
    this.app.db.on('users.afterCreateWithAssociations', createMergeRole.bind(this.app));
    // 给用户增加/删除 角色
    this.app.db.on('users.afterUpdateWithAssociations', userChangeRoles.bind(this.app));

    this.app.on('dataSource:writeToAcl', async ({ roleName, transaction }) => {
      const affectedUsers = await this.app.db.getRepository('users').find({
        filter: {
          'roles.name': roleName,
        },
        appends: ['selfRole'],
      });
      if (!affectedUsers.length) {
        return;
      }
      const affectedRoles = affectedUsers.map((u) => u.selfRole) as MergeRoleModel[];
      const acl = this.app.acl;
      for (const affectedRole of affectedRoles) {
        await affectedRole.refreshDataSourcesAcl({ transaction, acl });
      }
    });
  }

  async load() {
    const ignoreMerged = () => ({ filter: { ownerUserId: null } });
    // 合并虚拟角色用户不能操作,只能自动操作
    this.app.acl.addFixedParams('roles', 'list', ignoreMerged);
    this.app.acl.addFixedParams('roles', 'update', ignoreMerged);
    this.app.acl.addFixedParams('roles', 'destroy', ignoreMerged);

    this.app.resourcer.use(setSelfRole, { tag: 'setSelfRole', before: 'setCurrentRole', after: 'setDepartmentsInfo' });
    this.app.resourcer.use(changeUserRolesMiddleware, { tag: 'changeUserRolesMiddleware' });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginSubAccountsServer;
