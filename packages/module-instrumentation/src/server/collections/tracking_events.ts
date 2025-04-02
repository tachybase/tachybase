import { CollectionOptions } from '@tachybase/database';

export default {
  name: 'trackingEvents',
  fields: [
    {
      name: 'id',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: 'bigInt',
    },
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'key',
    },
    {
      type: 'jsonb',
      name: 'values',
    },
  ],
} as CollectionOptions;
