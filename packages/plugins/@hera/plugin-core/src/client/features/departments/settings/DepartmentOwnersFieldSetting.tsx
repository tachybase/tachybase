import { SchemaSettings } from '@tachybase/client';
import { neItems } from '../items/neItems';
import { teItems } from '../items/teItems';
import { reItems } from '../items/reItems';

export const DepartmentOwnersFieldSetting = new SchemaSettings({
  name: 'fieldSettings:component:DepartmentOwnersField',
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
