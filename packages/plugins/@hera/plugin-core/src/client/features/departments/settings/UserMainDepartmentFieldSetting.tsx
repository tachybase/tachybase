import { SchemaSettings } from '@tachybase/client';

import { enableLinkItem } from './items/enableLinkItem';
import { modeSelectItem } from './items/modeSelectItem';
import { titleFieldItem } from './items/titleFieldItem';

export const UserMainDepartmentFieldSetting = new SchemaSettings({
  name: 'fieldSettings:component:UserMainDepartmentField',
  items: [modeSelectItem, titleFieldItem, enableLinkItem],
});
