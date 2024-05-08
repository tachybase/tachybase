import { CollectionOptions } from '@tachybase/database';

export default {
  name: 'categories',
  fields: [
    {
      type: 'string',
      name: 'title',
    },
    {
      type: 'hasMany',
      name: 'posts',
    },
  ],
} as CollectionOptions;
