import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'log',
  },
  shared: true,
  name: 'tokenBlacklist',
  model: 'TokenBlacklistModel',
  fields: [
    {
      type: 'text',
      name: 'token',
      index: true,
    },
    {
      type: 'date',
      name: 'expiration',
    },
  ],
});
