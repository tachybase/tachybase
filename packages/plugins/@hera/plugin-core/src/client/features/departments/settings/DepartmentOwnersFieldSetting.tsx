import { SchemaSettings } from '@tachybase/client';

import { neItems } from '../items/neItems';
import { reItems } from '../items/reItems';
import { teItems } from '../items/teItems';

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
