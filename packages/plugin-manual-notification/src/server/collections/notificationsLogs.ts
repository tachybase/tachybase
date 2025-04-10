import { CollectionOptions } from '@tachybase/database';

export default {
  name: 'notificationLogs',
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
      name: 'title',
    },
    {
      type: 'string',
      name: 'detail',
    },
    {
      type: 'float',
      name: 'duration',
    },
    {
      type: 'date',
      name: 'expireAt',
    },
    {
      type: 'string',
      name: 'level',
    },
    {
      name: 'notifyType',
      type: 'string',
    },
  ],
} as CollectionOptions;
