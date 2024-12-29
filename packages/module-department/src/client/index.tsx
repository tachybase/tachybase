import { Plugin } from '@tachybase/client';

import { UserDepartmentsFieldNotSupport } from './common/UserDepartmentsFieldNotSupport';
import { KitMainTabDepartments } from './main-tab/kit';
import { KitRoleAuth } from './role-auth/kit';
import { DepartmentOwnersFieldSetting } from './settings/DepartmentOwnersFieldSetting';
import { UserDepartmentsFieldSetting } from './settings/UserDepartmentsFieldSetting';
import { UserMainDepartmentFieldSetting } from './settings/UserMainDepartmentFieldSetting';

export class DepartmentsPlugin extends Plugin {
  async afterAdd() {
    // 用户和权限-部门
    this.pm.add(KitMainTabDepartments);
    // 用户和权限-角色和权限-部门
    this.pm.add(KitRoleAuth);
  }
  async load() {
    this.app.addComponents({
      UserDepartmentsField: UserDepartmentsFieldNotSupport,
      UserMainDepartmentField: UserDepartmentsFieldNotSupport,
      DepartmentOwnersField: UserDepartmentsFieldNotSupport,
    });

    this.app.schemaSettingsManager.add(UserDepartmentsFieldSetting);
    this.app.schemaSettingsManager.add(UserMainDepartmentFieldSetting);
    this.app.schemaSettingsManager.add(DepartmentOwnersFieldSetting);
  }
}

export default DepartmentsPlugin;
