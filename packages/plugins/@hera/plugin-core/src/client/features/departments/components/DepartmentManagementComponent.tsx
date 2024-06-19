import React from 'react';
import { SchemaComponent } from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { DepartmentManagement } from './DepartmentManagement';

export const DepartmentManagementComponent = () => {
  return (
    <SchemaComponent
      components={{ DepartmentManagement }}
      schema={{
        type: 'void',
        properties: {
          [uid()]: {
            type: 'void',
            'x-decorator': 'CardItem',
            'x-component': 'DepartmentManagement',
          },
        },
      }}
    />
  );
};
