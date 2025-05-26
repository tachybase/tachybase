import { SchemaInitializer } from '../../../../application/schema-initializer/SchemaInitializer';
import {
  AssociatedFields,
  ExtendCollectionFields,
  ParentCollectionFields,
} from '../../../../schema-initializer/buttons/FormItemInitializers';
import { gridRowColWrap, useFormItemInitializerFields } from '../../../../schema-initializer/utils';

export const formItemInitializers = new SchemaInitializer({
  name: 'form:configureFields',
  wrap: gridRowColWrap,
  icon: 'SettingOutlined',
  title: '{{t("Configure fields")}}',
  items: [
    {
      type: 'itemGroup',
      name: 'displayFields',
      title: '{{t("Display fields")}}',
      useChildren: useFormItemInitializerFields,
    },
    {
      name: 'parentCollectionFields',
      Component: ParentCollectionFields,
    },
    {
      name: 'extendCollectionFields',
      Component: ExtendCollectionFields,
    },
    {
      name: 'associationFields',
      Component: AssociatedFields,
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'addText',
      title: '{{t("Add text")}}',
      Component: 'MarkdownFormItemInitializer',
    },
  ],
});
