import { ACL, ACLResource, ACLResourceActions, AvailableStrategyOptions, RoleActionParams } from '@tachybase/acl';
import { Transaction } from '@tachybase/database';
import { RoleModel } from '@tachybase/plugin-acl';

import { RoleActionParamsMerge } from '../acl/RoleActionParamsMerge';
import { RoleSnippets } from '../acl/RoleSnippets';
import { RoleStrategy } from '../acl/RoleStrategy';

export class MergeRoleModel extends RoleModel {
  rootResource: MergeRoleModel;

  /**
   * 获取源头角色
   * @param transaction
   * @returns
   */
  public async getSourceRoles(transaction: Transaction) {
    const user = await this.getOwnerUser({ transaction });
    return await user.getRoles({ appends: ['menuUiSchemas'], transaction });
  }

  /**
   * 数据表操作权限更新
   */
  public async refreshDataSourcesAcl({ transaction, acl }: { transaction?: Transaction; acl: ACL }) {
    const strategyArray: Array<string | AvailableStrategyOptions> = [];
    const resourcesMap: Map<string, ACLResourceActions[]> = new Map();
    const transactionExist = !!transaction;
    if (!transaction) {
      transaction = await this.db.sequelize.transaction();
    }

    this.sourceRoles = await this.getSourceRoles(transaction);
    if (this.sourceRoles.find((r) => r.name === 'root')) {
      if (!transactionExist) {
        transaction.commit();
      }
      return;
    }
    // 实现数据表权限逻辑
    for (const sourceRole of this.sourceRoles) {
      let sourceAclRole = acl.getRole(sourceRole.name);
      if (!sourceAclRole) {
        sourceAclRole = acl.define({
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
    const aclRole = acl.getRole(this.name);
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

    if (!transactionExist) {
      transaction.commit();
    }
  }

  /**
   * 数据表操作权限更新
   */
  public refreshDataSourcesAclForResource(acl: ACL, resourceName: string, actionName: string) {
    // 实现数据表权限逻辑
    // for (const sourceRole of this.sourceRoles) {
    //   const aclRole = acl.getRole(sourceRole.name);
    // }
  }

  /**
   * source变动后导致本身属性或者ui有关属性变动
   */
  public async resetAcl({
    transaction,
    acl,
    changedFields,
  }: {
    transaction?: Transaction;
    acl: ACL;
    changedFields?: string[];
  }) {
    if (!this.ownerUserId) {
      return;
    }
    const transactionExist = !!transaction;
    if (!transaction) {
      transaction = await this.db.sequelize.transaction();
    }
    this.sourceRoles = await this.getSourceRoles(transaction);
    // 关于root的特殊情况
    this.rootResource = this.sourceRoles.find((role) => role.name === 'root');
    this.resetRoleProperty(transaction);
    if (!changedFields || changedFields.includes('snippets')) {
      await this.mergeSnippets();
    }
    // await this.resetRoleAssociation(transaction);
    // 如果是源角色未发生menuUiSchemas的变化
    if (!changedFields || changedFields.includes('menuUiSchemas')) {
      await this.mergeMenuUiSchemas(transaction);
    }

    await this.save({ transaction });
    if (!transactionExist) {
      await transaction.commit();
    }
    this.writeToAcl({ acl, withOutStrategy: true });
  }

  /**
   * role本身属性变动
   */
  private resetRoleProperty(transaction?: Transaction) {
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
  private mergeStrategy() {
    throw new Error('Method not implemented.');
  }

  /**
   * 融合短语,体现在[权限页面][系统管理],主要影响[配置页面] [配置插件] [重启应用]
   * 主要是 ui.* pm.* app.* 等短语
   */
  private mergeSnippets() {
    if (this.rootResource) {
      this.snippets = ['ui.*', 'pm', 'pm.*'];
      return;
    }
    if (this.sourceRoles.length === 0) {
      // 和member默认保持一致
      this.snippets = ['!ui.*', '!pm', '!pm.*'];
      return;
    }
    if (this.sourceRoles.length === 1) {
      this.snippets = this.sourceRoles[0].snippets;
      return;
    }
    const snippets: Set<string>[] = [];
    for (const sourceRole of this.sourceRoles) {
      snippets.push(new Set(sourceRole.snippets));
    }
    this.snippets = RoleSnippets.mergeSet(snippets);
  }

  private async mergeMenuUiSchemas(transaction?: Transaction) {
    if (this.rootResource) {
      await this.setMenuUiSchemas([], { transaction });
      return;
    }
    const menuUiSchemaNamesSet = [];
    const menuUiSchemasList = [];
    // const menuUiSchemaSet = new Set();
    for (const sourceRole of this.sourceRoles) {
      const menuUiSchemas = await sourceRole.getMenuUiSchemas();
      for (const menuUiSchema of menuUiSchemas) {
        const xUid = menuUiSchema.get('x-uid');
        if (menuUiSchemaNamesSet.includes(xUid)) {
          continue;
        }
        menuUiSchemaNamesSet.push(xUid);
        menuUiSchemasList.push(menuUiSchema);
      }
    }
    await this.setMenuUiSchemas(menuUiSchemasList, { transaction });
  }

  // 由于数据库操作,还要分表,每个表还有不同的权限策略,此处不保存到数据库,而是在内存中进行操作
  private mergeDataSource(Transaction?: Transaction) {
    throw new Error('Method not implemented.');
  }
}
