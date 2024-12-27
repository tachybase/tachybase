import { SchemaSettings } from '@tachybase/client';

export const GroupBlockSettings = new SchemaSettings({
  name: 'groupBlockSettings',
  items: [
    {
      name: 'Configure',
      Component: 'GroupBlockConfigure',
    },
    {
      name: 'remove',
      type: 'remove',
    },
  ],
});
