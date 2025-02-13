import { CollectionOptions } from '@tachybase/database';

export default {
  dumpRules: {
    group: 'log',
  },
  name: 'apiLogsConfig',
  createdBy: false,
  updatedBy: false,
  updatedAt: false,
  createdAt: false,
  shared: true,
  autoGenId: false,
  model: 'CollectionModel',
  fields: [
    {
      type: 'string',
      name: 'name',
      primaryKey: true,
    },
    {
      type: 'string',
      name: 'action',
    },
    {
      type: 'boolean',
      name: 'apiConfig',
      defaultValue: true,
    },
  ],
} as CollectionOptions;
