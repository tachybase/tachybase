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
    {
      type: 'bigInt',
      name: 'userId',
      primaryKey: true,
    },
    {
      type: 'string',
      name: 'roleName',
      primaryKey: true,
    },
  ],
});
