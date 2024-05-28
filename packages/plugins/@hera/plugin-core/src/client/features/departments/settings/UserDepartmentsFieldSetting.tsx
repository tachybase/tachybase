import { SchemaSettings } from '@tachybase/client';
import { neItems } from '../items/neItems';
import { teItems } from '../items/teItems';
import { reItems } from '../items/reItems';

export const UserDepartmentsFieldSetting = new SchemaSettings({
  name: 'fieldSettings:component:UserDepartmentsField',
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
