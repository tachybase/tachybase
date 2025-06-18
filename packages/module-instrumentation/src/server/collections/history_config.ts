import { CollectionOptions } from '@tachybase/database';

export default {
  dumpRules: {
    group: 'log',
  },
  name: 'trackingHistoryOptions',
  createdBy: false,
  updatedBy: false,
  updatedAt: false,
  createdAt: false,
  shared: true,
  model: 'CollectionModel',
  fields: [
    {
      type: 'string',
      name: 'title',
    },
    {
      type: 'jsonb',
      name: 'historyOptions',
    },
  ],
} as CollectionOptions;
