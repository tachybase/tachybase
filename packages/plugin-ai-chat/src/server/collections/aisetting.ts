import { CollectionOptions } from '@tachybase/database';

export default {
  name: 'aisettings',
  shared: true,
  createdAt: false,
  updatedAt: false,
  createdBy: false,
  updatedBy: false,
  fields: [
    {
      type: 'string',
      name: 'Model',
    },
    {
      type: 'string',
      name: 'AI_URL',
    },
    {
      type: 'encryption',
      name: 'AI_API_KEY',
      interface: 'encryption',
      iv: 'mlbcs3d6i60962i6',
    },
  ],
} as CollectionOptions;
