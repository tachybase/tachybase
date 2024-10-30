import { Plugin } from '@tachybase/client';

import { tval } from '../../../locale';
import { DepartmentIndex } from './DepartmentIndex';

export class KitMainTabDepartments extends Plugin {
  async load() {
    // 用户-部门-角色和权限
    this.app.systemSettingsManager.add('users-permissions.departments', {
      icon: 'ApartmentOutlined',
      title: tval('Departments'),
      sort: 2,
      aclSnippet: 'pm.departments',
      Component: DepartmentIndex,
    });
  }
}
