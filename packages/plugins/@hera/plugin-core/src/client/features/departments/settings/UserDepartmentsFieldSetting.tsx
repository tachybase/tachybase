import { SchemaSettings } from '@tachybase/client';

import { neItems } from '../items/neItems';
import { reItems } from '../items/reItems';
import { teItems } from '../items/teItems';

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
