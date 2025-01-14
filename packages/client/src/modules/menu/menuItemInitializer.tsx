import { SchemaInitializer } from '../../application/schema-initializer/SchemaInitializer';
import { GroupItem } from './GroupItem';
import { LinkMenuItem } from './LinkMenuItem';
import { PageMenuItem } from './PageMenuItem';

export const menuItemInitializer = new SchemaInitializer({
  name: 'menuInitializers:menuItem',
  insertPosition: 'beforeEnd',
  icon: 'PlusOutlined',
  title: '{{t("Add menu item")}}',
  items: [
    {
      name: 'submenu',
      Component: GroupItem,
    },
    {
      name: 'page',
      Component: PageMenuItem,
    },
    {
      name: 'link',
      Component: LinkMenuItem,
    },
  ],
});
