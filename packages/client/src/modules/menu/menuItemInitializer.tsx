import { SchemaInitializer } from '../../application/schema-initializer/SchemaInitializer';
import { GroupItem } from './GroupItem';
import { LinkMenuItem } from './LinkMenuItem';
import { PageMenuItem } from './PageMenuItem';

/**
 * @deprecated
 */
export const menuItemInitializer_deprecated = new SchemaInitializer({
  name: 'MenuItemInitializers',
  insertPosition: 'beforeEnd',
  icon: 'PlusOutlined',
  title: '{{t("Add menu item")}}',
  style: {
    width: '100%',
  },
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