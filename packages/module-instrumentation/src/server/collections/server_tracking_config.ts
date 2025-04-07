import { CollectionOptions } from '@tachybase/database';

export default {
  dumpRules: {
    group: 'log',
  },
  name: 'serverTrackingConfig',
  createdBy: false,
  updatedBy: false,
  updatedAt: false,
  createdAt: false,
  shared: true,
  model: 'CollectionModel',
  fields: [
    {
      type: 'string',
      name: 'resourceName',
    },
    // {
    //   type: 'string',
    //   name: 'title',
    // },
    {
      type: 'string',
      name: 'action',
    },
    {
      type: 'boolean',
      name: 'apiConfig',
      defaultValue: true,
    },
    {
      type: 'jsonb',
      name: 'keys',
    },
  ],
  indexes: [
    {
      fields: ['resourceName', 'action'],
      unique: true,
    },
  ],
} as CollectionOptions;
