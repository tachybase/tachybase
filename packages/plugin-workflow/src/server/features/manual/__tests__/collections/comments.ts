import { CollectionOptions } from '@tachybase/database';

export default {
  name: 'comments',
  fields: [
    {
      type: 'belongsTo',
      name: 'post',
    },
    {
      type: 'text',
      name: 'content',
    },
    {
      type: 'integer',
      name: 'status',
      defaultValue: 0,
    },
    {
      type: 'hasMany',
      name: 'replies',
    },
  ],
} as CollectionOptions;
