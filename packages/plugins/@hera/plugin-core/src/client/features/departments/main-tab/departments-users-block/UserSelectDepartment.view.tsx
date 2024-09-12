import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { useTranslation } from '../../../../locale';
import { ViewDepartmentTable } from '../../common/DepartmentTable.view';
import { useDataSource } from './scopes/useDataSource';
import { schemaUserSelectDepartment as schema } from './UserSelectDepartment.schema';

export const ViewUserSelectDepartment = (props) => {
  const { t } = useTranslation();
  const { user, useAddDepartments, useDisabled } = props;
  return (
    <SchemaComponent
      key={2}
      schema={schema}
      components={{
        DepartmentTable: ViewDepartmentTable,
      }}
      scope={{
        t,
        user,
        useDataSource,
        useAddDepartments,
        useDisabled,
      }}
    />
  );
};
