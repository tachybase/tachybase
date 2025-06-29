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
      type: 'string',
      name: 'token',
      index: true,
      length: 512,
    },
    {
      type: 'date',
      name: 'expiration',
    },
  ],
});
