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
      name: 'content',
    },
    {
      type: 'float',
      name: 'duration',
    },
    {
      type: 'string',
      name: 'level',
    },
    {
      name: 'notifyType',
      type: 'string',
    },
    {
      type: 'date',
      name: 'endTime',
    },
    {
      type: 'date',
      name: 'startTime',
    },
  ],
} as CollectionOptions;
