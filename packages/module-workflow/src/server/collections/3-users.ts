import { extendCollection } from '@tachybase/database';

export default extendCollection({
  name: 'users',
  fields: [
    {
      type: 'belongsToMany',
      name: 'jobs',
      through: 'users_jobs',
    },
    {
      type: 'hasMany',
      name: 'usersJobs',
      target: 'users_jobs',
    },
  ],
});
