import { defineCollection } from '@tachybase/database';

// ip黑白名单
export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: 'signInFails',
  createdAt: true,
  updatedAt: false,
  createdBy: false,
  updatedBy: false,
  fields: [
    {
      type: 'bigInt',
      name: 'userId',
    },
    {
      type: 'string',
      name: 'ip',
    },
    {
      type: 'string',
      name: 'address',
    },
  ],
});
