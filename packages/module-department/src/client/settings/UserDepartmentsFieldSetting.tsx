import { SchemaSettings } from '@tachybase/client';

import { enableLinkItem } from './items/enableLinkItem';
import { modeSelectItem } from './items/modeSelectItem';
import { titleFieldItem } from './items/titleFieldItem';

export const UserDepartmentsFieldSetting = new SchemaSettings({
  name: 'fieldSettings:component:UserDepartmentsField',
  items: [modeSelectItem, titleFieldItem, enableLinkItem],
});
