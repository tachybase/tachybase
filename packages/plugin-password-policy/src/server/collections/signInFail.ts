import { defineCollection } from '@tachybase/database';

// 登录失败记录
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
  ],
});
