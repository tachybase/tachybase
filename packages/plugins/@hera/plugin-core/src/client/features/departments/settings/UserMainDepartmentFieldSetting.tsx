import { SchemaSettings } from '@tachybase/client';

import { neItems } from '../items/neItems';
import { reItems } from '../items/reItems';
import { teItems } from '../items/teItems';

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
