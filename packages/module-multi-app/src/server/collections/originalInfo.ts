import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'third-party',
  },
  name: 'originalInfo',
  autoGenId: false,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'bigInt',
      name: 'create_user_id', // 主应用的用户id,即使是爷孙关系,也应该是爷爷的用户id
    },
    {
      type: 'string',
      name: 'parent_id',
    },
  ],
});
