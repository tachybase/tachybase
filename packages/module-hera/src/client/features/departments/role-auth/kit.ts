import { Plugin } from '@tachybase/client';
import PluginACLClient from '@tachybase/module-acl/client';

import { tval } from '../../../locale';
import { Departments } from './Departments';

export class KitRoleAuth extends Plugin {
  async load() {
    // 角色和权限: 部门管理
    this.app.pm.get(PluginACLClient).rolesManager.add('departments', {
      title: tval('Departments'),
      Component: Departments,
    });
  }
}
