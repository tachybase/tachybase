import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { getSchemaDepartmentTable } from './DepartmentTable.schema';
import { InternalDepartmentTable } from './InternalDepartmentTable';
import { ProviderRequest } from './Request.povider';
import { useFilterActionProps } from './scopes/useFilterActionProps';

export const ViewDepartmentTable = ({ useDataSource, useDisabled }) => {
  const schema = getSchemaDepartmentTable({ useDataSource });
  return (
    <SchemaComponent
      schema={schema}
      components={{
        RequestProvider: ProviderRequest,
        InternalDepartmentTable,
      }}
      scope={{
        useDisabled,
        useFilterActionProps,
      }}
    />
  );
};
