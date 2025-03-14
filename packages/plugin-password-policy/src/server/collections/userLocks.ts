import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: 'userLocks',
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'bigInt',
      name: 'userId',
      unique: true,
    },
    {
      type: 'date',
      name: 'expireAt',
    },
    {
      type: 'belongsTo',
      name: 'user',
      target: 'users',
      foreignKey: 'userId',
    },
  ],
});
