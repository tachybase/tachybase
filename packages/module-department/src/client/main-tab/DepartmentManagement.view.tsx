import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { DepartmentManagement } from './DepartmentManagement.component';
import { schemaDepartmentManagement as schema } from './DepartmentManagement.schema';

export const ViewDepartmentManagement = () => {
  return (
    <SchemaComponent
      schema={schema}
      components={{
        DepartmentManagement,
      }}
    />
  );
};
