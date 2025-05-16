import { CollectionOptions } from '@tachybase/database';

export default {
  dumpRules: {
    group: 'log',
  },
  name: 'trackingEvents',
  createdAt: true,
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
