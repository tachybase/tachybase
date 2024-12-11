import { CollectionOptions } from '@tachybase/database';

import { DATABASE_CRON_JOBS_EXECUTIONS } from '../../constants';

export default {
  dumpRules: {
    group: 'required',
  },
  name: DATABASE_CRON_JOBS_EXECUTIONS,
  shared: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'bigInt',
      name: 'id',
      primaryKey: true,
      autoIncrement: true,
    },
    // 执行耗时(ms)
    {
      type: 'integer',
      name: 'duration',
    },
  ],
} as CollectionOptions;
