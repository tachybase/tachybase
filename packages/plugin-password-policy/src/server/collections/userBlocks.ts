import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: 'userBlocks',
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'bigInt',
      name: 'userId',
    },
    {
      type: 'date',
      name: 'expireAt',
    },
    {
      type: 'belongsTo',
      name: 'users',
      target: 'users',
      foreignKey: 'userId',
    },
  ],
});
