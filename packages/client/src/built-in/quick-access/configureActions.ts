import { SchemaInitializer } from '../../application';
import { QuickAccessLinkActionSchemaInitializerItem } from './LinkActionSchemaInitializerItem';

export const quickAccessConfigureActions = new SchemaInitializer({
  name: 'quickAccess:configureActions',
  title: '{{t("Configure actions")}}',
  // 插入位置
  insertPosition: 'beforeEnd',
  items: [
    {
      name: 'link',
      title: '{{t("Link")}}',
      Component: QuickAccessLinkActionSchemaInitializerItem,
    },
  ],
});
