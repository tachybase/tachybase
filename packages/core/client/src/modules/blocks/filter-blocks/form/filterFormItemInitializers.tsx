import { CompatibleSchemaInitializer } from '../../../../application/schema-initializer/CompatibleSchemaInitializer';
import {
  FilterAssociatedFields,
  FilterParentCollectionFields,
} from '../../../../schema-initializer/buttons/FormItemInitializers';
import { gridRowColWrap, useFilterFormItemInitializerFields } from '../../../../schema-initializer/utils';

/**
 * @deprecated
 */
export const filterFormItemInitializers_deprecated = new CompatibleSchemaInitializer({
  name: 'FilterFormItemInitializers',
  wrap: gridRowColWrap,
  icon: 'SettingOutlined',
  title: '{{t("Configure fields")}}',
  items: [
    {
      type: 'subMenu',
      name: 'displayFields',
      title: '{{t("Display fields")}}',
      useChildren: useFilterFormItemInitializerFields,
    },
    {
      name: 'parentCollectionFields',
      Component: FilterParentCollectionFields,
    },
    {
      name: 'associationFields',
      Component: FilterAssociatedFields,
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      title: '{{t("Add text")}}',
      Component: 'MarkdownFormItemInitializer',
      name: 'addText',
    },
    {
      title: '{{t("Custom filter field")}}',
      name: 'custom',
      type: 'item',
      Component: 'FilterFormItemCustom',
    },
  ],
});

export const filterFormItemInitializers = new CompatibleSchemaInitializer(
  {
    name: 'filterForm:configureFields',
    wrap: gridRowColWrap,
    icon: 'SettingOutlined',
    title: '{{t("Configure fields")}}',
    items: [
      {
        type: 'subMenu',
        name: 'displayFields',
        title: '{{t("Display fields")}}',
        useChildren: useFilterFormItemInitializerFields,
      },
      {
        name: 'parentCollectionFields',
        Component: FilterParentCollectionFields,
      },
      {
        name: 'associationFields',
        Component: FilterAssociatedFields,
      },
      {
        name: 'divider',
        type: 'divider',
      },
      {
        title: '{{t("Add text")}}',
        Component: 'MarkdownFormItemInitializer',
        name: 'addText',
      },
      {
        title: '{{t("Custom filter field")}}',
        name: 'custom',
        type: 'item',
        Component: 'FilterFormItemCustom',
      },
    ],
  },
  filterFormItemInitializers_deprecated,
);
