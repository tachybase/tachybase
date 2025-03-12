import { defineCollection } from '@tachybase/database';

// ip黑白名单
export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: 'ipFilter',
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'text',
      name: 'allowList', //换行分割,支持cidr 比如127.0.0.1/24这样
    },
    {
      type: 'text',
      name: 'blockList', //换行分割
    },
    {
      type: 'boolean',
      name: 'allowFirst', //白名单优先还是黑名单优先
      default: true,
    },
  ],
});
