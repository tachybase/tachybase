import { defineCollection } from '@tachybase/database';

// 密码历史记录
export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: 'passwordHistory',
  createdAt: true,
  updatedAt: false,
  createdBy: false,
  updatedBy: false,
  fields: [
    {
      type: 'belongsTo',
      name: 'user',
      target: 'users',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    },
    {
      type: 'password',
      name: 'password',
    },
  ],
});
