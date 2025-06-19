import { SchemaSettings, SchemaSettingsBlockTitleItem } from '@tachybase/client';

export const stepsFormBlockSettings = new SchemaSettings({
  name: 'blockSettings:stepsForm',
  items: [
    {
      name: 'StepsForm',
      Component: SchemaSettingsBlockTitleItem,
    },
    {
      type: 'remove',
      name: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
        breakRemoveOn: {
          'x-component': 'Grid',
        },
      },
    },
  ],
});
