import { CollectionFieldsToFormInitializerItems, Grid, SchemaInitializer } from '@tachybase/client';
import { tval } from '@tachybase/utils';

export const stepFormFieldsInitializer = new SchemaInitializer({
  name: 'stepsForm:configureFields',
  icon: 'SettingOutlined',
  wrap: Grid.wrap,
  title: tval('Configure fields'),
  items: [
    {
      name: 'collectionFields',
      Component: CollectionFieldsToFormInitializerItems,
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'addText',
      title: tval('Add text'),
      Component: 'MarkdownFormItemInitializer',
    },
  ],
});
