import { Plugin } from '@tachybase/server';

import { addMergeRole } from './addMergeRoles';
import {
  mergeRoleCreate,
  refreshDataSourcesAclAtAppStart,
  roleDepartmentUpdate,
  sourceRoleDestroy,
  sourceRoleUpdate,
  userChangeRoles,
  userDepartmentUpdate,
  userRoleChange,
} from './hooks';
import { createMergeRole } from './hooks/user-create';
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
      // addMergeRole和refreshDataSourcesAclAtAppStart会有重复的
      await addMergeRole(this.app);
      await refreshDataSourcesAclAtAppStart(this.app);
    });

    this.app.db.on('roles.afterUpdate', async (model, options) => {
      return sourceRoleUpdate(this.app, model, options);
    });
    this.app.db.on('roles.afterDestroy', async (model, options) => {
      return sourceRoleDestroy(this.app, model, options);
    });
    this.app.db.on('roles.afterCreate', async (model, options) => {
      return mergeRoleCreate(this.app, model, options);
    });

    // 新建用户
    this.app.db.on('users.afterCreateWithAssociations', async (model, options) => {
      return createMergeRole(this.app, model, options);
    });

    // 给角色增加/减少页面权限
    this.app.db.on('rolesUiSchemas.afterSave', async (model, options) => {
      const role = (await this.app.db.getModel('roles').findByPk(model.get('roleName'))) as MergeRoleModel;
      await sourceRoleUpdate(this.app, role, { ...options, fields: ['uiSchemas'] });
    });
    this.app.db.on('rolesUiSchemas.afterDestroy', async (model, options) => {
      const role = (await this.app.db.getModel('roles').findByPk(model.get('roleName'))) as MergeRoleModel;
      await sourceRoleUpdate(this.app, role, { ...options, fields: ['uiSchemas'] });
    });
    this.app.db.on('rolesUiSchemas.afterBulkCreate', async (models, options) => {
      const roleNames = models.map((model) => model.get('roleName')) as string[];
      // 去重
      const uniqueRoleNames = [...new Set(roleNames)];
      await Promise.all(
        uniqueRoleNames.map(async (roleName) => {
          const role = (await this.app.db.getModel('roles').findByPk(roleName)) as MergeRoleModel;
          await sourceRoleUpdate(this.app, role, { ...options, fields: ['uiSchemas'] });
        }),
      );
    });
    this.app.db.on('rolesUiSchemas.afterBulkDestroy', async (options) => {
      const deleteModels = await this.app.db.getModel('rolesUsers').findAll({ where: options.where });
      const roleNames = deleteModels.map((model) => model.get('roleName')) as string[];
      // 去重
      const uniqueRoleNames = [...new Set(roleNames)];
      await Promise.all(
        uniqueRoleNames.map(async (roleName) => {
          const role = (await this.app.db.getModel('roles').findByPk(roleName)) as MergeRoleModel;
          await sourceRoleUpdate(this.app, role, { ...options, fields: ['uiSchemas'] });
        }),
      );
    });

    // 给用户增加/删除 角色
    this.app.db.on('rolesUsers.afterSave', async (model, options) => {
      await userRoleChange(this.app, model.userId, options);
    });
    this.app.db.on('rolesUsers.afterDestroy', async (model, options) => {
      await userRoleChange(this.app, model.userId, options);
    });
    this.app.db.on('rolesUsers.afterBulkCreate', async (models, options) => {
      const userIds = models.map((model) => model.get('userId')) as number[];
      // 去重
      const uniqueUserIds = [...new Set(userIds)];
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          await userRoleChange(this.app, userId, options);
        }),
      );
    });
    this.app.db.on('rolesUsers.afterBulkDestroy', async (options) => {
      const deleteModels = await this.app.db.getModel('rolesUsers').findAll({ where: options.where });
      const userIds = deleteModels.map((model) => model.get('userId')) as number[];
      // 去重
      const uniqueUserIds = [...new Set(userIds)];
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          await userRoleChange(this.app, userId, options);
        }),
      );
    });

    // 给部门增加/删除角色 TODO: 需要优化, 需要优化一个部门加多个角色需要优化
    this.app.db.on('departmentsRoles.afterSave', async (model, options) => {
      return roleDepartmentUpdate(this.app, model, options);
    });
    this.app.db.on('departmentsRoles.afterDestroy', async (model, options) => {
      return roleDepartmentUpdate(this.app, model, options);
    });

    // 给用户增加部门/删除部门
    this.app.db.on('departmentsUsers.afterSave', async (model, options) => {
      await this.app.cache.del(`departments:${model.get('userId')}`);
      return userDepartmentUpdate(this.app, model, options);
    });
    this.app.db.on('departmentsUsers.afterBulkCreate', async (models, options) => {
      const cache = this.app.cache;
      await Promise.all(
        models.map(async (model) => {
          await cache.del(`departments:${model.get('userId')}`);
          return userDepartmentUpdate(this.app, model, options);
        }),
      );
    });
    this.app.db.on('departmentsUsers.afterDestroy', async (model, options) => {
      await this.app.cache.del(`departments:${model.get('userId')}`);
      return userDepartmentUpdate(this.app, model, options);
    });
    this.app.db.on('departmentsUsers.afterBulkDestroy', async (options) => {
      const deleteModels = await this.app.db.getModel('departmentsUsers').findAll({ where: options.where });
      const cache = this.app.cache;
      await Promise.all(
        deleteModels.map(async (model) => {
          await cache.del(`departments:${model.get('userId')}`);
          return userDepartmentUpdate(this.app, model, options);
        }),
      );
    });

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
      for (const affectedRole of affectedRoles) {
        await affectedRole.refreshDataSourcesAcl({ transaction, app: this.app });
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
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginSubAccountsServer;
