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
      name: 'user',
      target: 'users',
      foreignKey: 'userId',
    },
  ],
  indexes: [
    {
      name: 'userId',
      fields: ['userId'],
      unique: true,
    },
  ],
});
