import { CollectionOptions } from '@tachybase/database';

export default {
  name: 'notificationConfigs',
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
  ],
} as CollectionOptions;
