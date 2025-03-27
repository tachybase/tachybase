import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'rolesUsers',
  dumpRules: {
    group: 'user',
  },
  fields: [
    {
      type: 'boolean',
      name: 'default',
    },
  ],
});
