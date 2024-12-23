import { ACL, ACLResource, ACLResourceActions, AvailableStrategyOptions, RoleActionParams } from '@tachybase/acl';
import { MultipleRelationRepository, Transaction } from '@tachybase/database';
import { RoleModel } from '@tachybase/module-acl';
import { Application } from '@tachybase/server';

import { RoleActionParamsMerge } from '../acl/RoleActionParamsMerge';
import { RoleSnippets } from '../acl/RoleSnippets';
import { RoleStrategy } from '../acl/RoleStrategy';

export class MergeRoleModel extends RoleModel {
  rootResource: MergeRoleModel;

  /**
   * 获取当前角色绑定的部门,获取部门里的所有用户
   * @param transaction
   * @returns
   */
  public async getMembersByDepartment(transaction) {
    if (this.ownerUserId) {
      return [];
    }

    const departments = await this.getDepartments({ append: ['members'], transaction });
    const users = new Map();
    for (const department of departments) {
      for (const user of department.members) {
        users.set(user.id, user);
      }
    }
    return Array.from(users.values());
  }

  /**
   * 获取用户的所有部门 并获得所有角色
   * @param transaction
   * @returns
   */
  public async getRolesByDepartment(transaction?: Transaction) {
    if (!this.ownerUserId) {
      return [];
    }
    const repo = this.db.getRepository<MultipleRelationRepository>('users.departments', this.ownerUserId);
    const departments = await repo.find({
      appends: ['roles', 'roles.menuUiSchemas', 'parent(recursively=true)'],
      transaction,
    });
    // 根据roles的name去重合并
    const roles = new Map();
    for (const department of departments) {
      for (const role of department.roles) {
        roles.set(role.name, role);
      }
    }
    return Array.from(roles.values());
  }

  /**
   * 获取源头角色
   * @param transaction
   * @returns
   */
  public async getSourceRoles(transaction?: Transaction) {
    const user = await this.getOwnerUser({ transaction });
    const selfRoles = await user.getRoles({ include: ['menuUiSchemas'], transaction });
    // 部门的角色
    const departmentRoles = await this.getRolesByDepartment(transaction);
    const uniqueRoles = new Map();
    for (const role of selfRoles.concat(departmentRoles)) {
      uniqueRoles.set(role.name, role);
    }
    return Array.from(uniqueRoles.values());
  }

  /**
   * 数据表操作权限更新
   */
  public async refreshDataSourcesAcl({ transaction, app }: { transaction?: Transaction; app: Application }) {
    const strategyArray: Array<string | AvailableStrategyOptions> = [];
    const resourcesMap: Map<string, ACLResourceActions[]> = new Map();

    this.sourceRoles = await this.getSourceRoles(transaction);
    if (this.sourceRoles.find((r) => r.name === 'root')) {
      return;
    }
    // 实现数据表权限逻辑
    for (const sourceRole of this.sourceRoles) {
      let sourceAclRole = app.acl.getRole(sourceRole.name);
      if (!sourceAclRole) {
        sourceAclRole = app.acl.define({
          role: sourceRole.name,
          strategy: {},
          actions: {},
        });
      }
      strategyArray.push(sourceAclRole.strategy);

      for (const [resourceName, value] of sourceAclRole.resources) {
        let list = resourcesMap.get(resourceName);
        if (!list) {
          list = [];
          resourcesMap.set(resourceName, list);
        }
        list.push(value.actions);
      }
    }

    // 合并strategy
    const aclRole = app.acl.getRole(this.name);
    aclRole.setStrategy({ ...RoleStrategy.merge(strategyArray) });

    // 合并resource
    const newResources = new Map<string, ACLResource>();
    for (const [resourceName, actions] of resourcesMap) {
      const actionMap: Map<string, RoleActionParams[]> = new Map();
      for (const action of actions) {
        for (const [actionName, params] of action) {
          let list = actionMap.get(actionName);
          if (!list) {
            list = [];
            actionMap.set(actionName, list);
          }
          list.push(params);
        }
      }

      const newActions = new Map<string, RoleActionParams>();
      for (const [actionName, params] of actionMap) {
        newActions.set(actionName, RoleActionParamsMerge.merge(params));
      }

      const newAclResource = new ACLResource({ role: aclRole, name: resourceName });
      newAclResource.actions = newActions;
      newResources.set(resourceName, newAclResource);
    }
    aclRole.resources = newResources;

    if (transaction) {
      app.logger.info(`refreshDataSourcesAcl after update ${this.name}`);
    } else {
      // app.logger.info(`refreshDataSourcesAcl after select ${this.name}`);
    }
  }

  /**
   * source变动后导致本身属性或者ui有关属性变动
   */
  public async resetAcl({
    transaction,
    app,
    changedFields,
  }: {
    transaction: Transaction;
    app: Application;
    changedFields?: string[];
  }) {
    if (!this.ownerUserId) {
      return;
    }
    this.sourceRoles = await this.getSourceRoles(transaction);
    // 关于root的特殊情况
    this.rootResource = this.sourceRoles.find((role) => role.name === 'root');
    this.resetRoleProperty();
    if (!changedFields || changedFields.includes('snippets')) {
      await this.mergeSnippets();
    }
    // await this.resetRoleAssociation(transaction);
    // 如果是源角色未发生menuUiSchemas的变化
    if (!changedFields || changedFields.includes('menuUiSchemas')) {
      await this.mergeMenuUiSchemas(transaction);
    }

    if (transaction) {
      await this.save({ transaction });
    }
    this.writeToAcl({ acl: app.acl, withOutStrategy: true });
  }

  /**
   * role本身属性变动
   */
  private resetRoleProperty() {
    /**
     * 整个系统中这个变量并没有起任何作用
     */
    this.allowConfigure = this.sourceRoles.some((role) => role.allowConfigure);
    this.allowNewMenu = this.sourceRoles.some((role) => role.allowNewMenu);
  }

  /**
   * 融合策略, 整个系统中这个变量会被主数据库 data-source-manager的DataSourcesRolesModel.writeToAcl方法设置覆盖
   * root为null
   * data-source的actions体现在[权限页面][数据源][配置][通用操作权限] 但是整个role下的
   * FIXME: strategy这个类型设置的很奇怪,目前只找到actions,依据AvailableStrategyOptions应该还有displayName,allowConfigure,resource
   */

  /**
   * 融合短语,体现在[权限页面][系统管理],主要影响[配置页面] [配置插件] [重启应用]
   * 主要是 ui.* pm.* app.* 等短语
   */
  private mergeSnippets() {
    let newSnippets = [];
    if (this.rootResource) {
      newSnippets = ['ui.*', 'pm', 'pm.*'];
    } else if (this.sourceRoles.length === 0) {
      // 和member默认保持一致
      newSnippets = ['!ui.*', '!pm', '!pm.*'];
    } else if (this.sourceRoles.length === 1) {
      newSnippets = this.sourceRoles[0].snippets;
    } else {
      const snippets: Set<string>[] = [];
      for (const sourceRole of this.sourceRoles) {
        snippets.push(new Set(sourceRole.snippets));
      }
      newSnippets = RoleSnippets.mergeSet(snippets);
    }

    const originalSnippets = this.snippets;
    let changed = originalSnippets.length !== newSnippets.length;
    if (!changed) {
      for (const snippet of newSnippets) {
        if (!originalSnippets.includes(snippet)) {
          changed = true;
          break;
        }
      }
    }
    if (changed) {
      this.snippets = newSnippets;
    }
  }

  private async mergeMenuUiSchemas(transaction?: Transaction) {
    const originalMenuUiSchemas = await this.getMenuUiSchemas({ transaction });
    let newMenuUiSchemas = [];
    if (this.rootResource) {
      newMenuUiSchemas = [];
    } else {
      const menuUiSchemaNamesSet = [];
      // const menuUiSchemaSet = new Set();
      for (const sourceRole of this.sourceRoles) {
        for (const menuUiSchema of sourceRole.menuUiSchemas) {
          const xUid = menuUiSchema.get('x-uid');
          if (menuUiSchemaNamesSet.includes(xUid)) {
            continue;
          }
          menuUiSchemaNamesSet.push(xUid);
          newMenuUiSchemas.push(menuUiSchema);
        }
      }
    }

    const toAddList: string[] = [];
    const toRemoveList: string[] = [];
    const sameList: string[] = [];
    for (const menuUiSchema of newMenuUiSchemas) {
      const xUid = menuUiSchema.get('x-uid');
      if (!originalMenuUiSchemas.find((m) => m.get('x-uid') === xUid)) {
        toAddList.push(xUid);
      } else {
        sameList.push(xUid);
      }
    }
    for (const menuUiSchema of originalMenuUiSchemas) {
      const xUid = menuUiSchema.get('x-uid');
      if (!sameList.includes(xUid)) {
        toRemoveList.push(xUid);
      }
    }
    if (toAddList.length) {
      await this.addMenuUiSchemas(toAddList, { transaction });
    }
    if (toRemoveList.length) {
      await this.removeMenuUiSchemas(toRemoveList, { transaction });
    }
  }
}
