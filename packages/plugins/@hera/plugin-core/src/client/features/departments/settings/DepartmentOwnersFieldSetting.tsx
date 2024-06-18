import { SchemaSettings } from '@tachybase/client';

import { enableLinkItem } from './items/enableLinkItem';
import { modeSelectItem } from './items/modeSelectItem';
import { titleFieldItem } from './items/titleFieldItem';

export const DepartmentOwnersFieldSetting = new SchemaSettings({
  name: 'fieldSettings:component:DepartmentOwnersField',
  items: [modeSelectItem, titleFieldItem, enableLinkItem],
});
