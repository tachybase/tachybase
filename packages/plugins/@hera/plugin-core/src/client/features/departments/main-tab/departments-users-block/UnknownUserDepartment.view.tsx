import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { ViewDepartmentTable } from '../../common/DepartmentTable.view';
import { useDataSource } from './scopes/useDataSource';
import { schemaUnknownUserDepartment as schema } from './UnknownUserDepartment.schema';

// TODO: 有待重新命名组件
export const ViewUnknownUserDepartment = (props) => {
  const { user, useAddDepartments, useDisabled } = props;
  return (
    <SchemaComponent
      key={2}
      schema={schema}
      components={{
        DepartmentTable: ViewDepartmentTable,
      }}
      scope={{
        user,
        useDataSource,
        useAddDepartments,
        useDisabled,
      }}
    />
  );
};
