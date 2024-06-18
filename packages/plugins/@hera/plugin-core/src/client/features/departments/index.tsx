import React from 'react';
import { Plugin, SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';
import PluginACLClient from '@tachybase/plugin-acl/client';

import { tval } from '../../locale';
import { Departments } from './components/Departments';
import { DepartmentsProvider } from './components/DepartmentsProvider';
import { MmtComponent } from './components/MmtComponent';
import { UserDepartmentsField } from './components/UserDepartmentsField';
import { DepartmentOwnersFieldSetting } from './settings/DepartmentOwnersFieldSetting';
import { UserDepartmentsFieldSetting } from './settings/UserDepartmentsFieldSetting';
import { UserMainDepartmentFieldSetting } from './settings/UserMainDepartmentFieldSetting';

export class DepartmentsPlugin extends Plugin {
  async load() {
    this.app.addComponents({
      UserDepartmentsField: UserDepartmentsField,
      UserMainDepartmentField: UserDepartmentsField,
      DepartmentOwnersField: UserDepartmentsField,
    });
    this.app.schemaSettingsManager.add(UserDepartmentsFieldSetting);
    this.app.schemaSettingsManager.add(UserMainDepartmentFieldSetting);
    this.app.schemaSettingsManager.add(DepartmentOwnersFieldSetting);
    this.app.pluginSettingsManager.add('users-permissions.departments', {
      icon: 'ApartmentOutlined',
      title: tval('Departments'),
      Component: () => {
        const context = useSchemaComponentContext();
        return (
          <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
            <DepartmentsProvider>
              <MmtComponent />
            </DepartmentsProvider>
          </SchemaComponentContext.Provider>
        );
      },
      sort: 2,
      aclSnippet: 'pm.departments',
    });
    this.app.pm.get(PluginACLClient).rolesManager.add('departments', {
      title: tval('Departments'),
      Component: Departments,
    });
  }
}
