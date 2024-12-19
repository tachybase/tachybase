import { CollectionOptions } from '@tachybase/database';

export default {
  name: 'users',
  fields: [
    {
      type: 'string',
      name: 'name',
    },
    {
      type: 'belongsTo',
      name: 'avatar',
      target: 'attachments',
    },
    {
      type: 'belongsToMany',
      name: 'pubkeys',
      target: 'attachments',
    },
    {
      type: 'belongsToMany',
      name: 'photos',
      target: 'attachments',
    },
  ],
} as CollectionOptions;
