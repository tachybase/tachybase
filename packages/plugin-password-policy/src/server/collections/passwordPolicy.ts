import { defineCollection } from '@tachybase/database';

import { COLLECTION_PASSWORD_POLICY } from '../../constants';

// 密码策略
export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: COLLECTION_PASSWORD_POLICY,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'integer',
      name: 'validityPeriod', // 密码有效期:天
    },
  ],
});
