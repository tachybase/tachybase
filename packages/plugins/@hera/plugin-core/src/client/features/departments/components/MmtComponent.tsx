import { SchemaComponent } from '@tachybase/client';
import { uid } from '@tachybase/schema';
import React from 'react';
import { DepartmentManagement } from './DepartmentManagement';

export const MmtComponent = () => {
  return (
    <SchemaComponent
      components={{ DepartmentManagement: DepartmentManagement }}
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

  // return jsx(SchemaComponent, {
  //   components: {
  //     DepartmentManagement: DepartmentManagement,
  //   },
  //   schema: {
  //     type: 'void',
  //     properties: {
  //       [uid()]: { type: 'void', 'x-decorator': 'CardItem', 'x-component': 'DepartmentManagement' },
  //     },
  //   },
  // });
};