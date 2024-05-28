import { SchemaSettings } from '@tachybase/client';
import { neItems } from '../items/neItems';
import { teItems } from '../items/teItems';
import { reItems } from '../items/reItems';

export const UserMainDepartmentFieldSetting = new SchemaSettings({
  name: 'fieldSettings:component:UserMainDepartmentField',
  items: [
    {
      ...reItems,
    },
    {
      ...teItems,
    },
    {
      ...neItems,
    },
  ],
});
