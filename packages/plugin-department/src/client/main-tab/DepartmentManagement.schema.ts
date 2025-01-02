import { uid } from '@tachybase/schema';

export const schemaDepartmentManagement = {
  type: 'void',
  properties: {
    [uid()]: {
      type: 'void',
      'x-decorator': 'CardItem',
      'x-component': 'DepartmentManagement',
    },
  },
};
