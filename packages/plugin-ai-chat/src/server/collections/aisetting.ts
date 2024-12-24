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
      type: 'string',
      name: 'AI_API_KEY',
    },
  ],
} as CollectionOptions;
