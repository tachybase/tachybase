import { extendCollection } from '@tachybase/database';

import { DATABASE_CRON_JOBS_EXECUTIONS } from '../../constants';

export default extendCollection({
  name: 'executions',
  fields: [
    {
      type: 'belongsToMany',
      name: 'cronJobs',
      through: DATABASE_CRON_JOBS_EXECUTIONS,
      onDelete: 'CASCADE',
    },
  ],
});
