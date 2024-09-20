import React from 'react';
import { SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';

import { ProviderDepartmentIndex } from './DepartmentIndex.provider';
import { ViewDepartmentManagement } from './DepartmentManagement.view';

/**
 * TODO: 组件名称有待重新确认
 * @returns
 */
export const DepartmentIndex = () => {
  const context = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
      <ProviderDepartmentIndex>
        <ViewDepartmentManagement />
      </ProviderDepartmentIndex>
    </SchemaComponentContext.Provider>
  );
};
