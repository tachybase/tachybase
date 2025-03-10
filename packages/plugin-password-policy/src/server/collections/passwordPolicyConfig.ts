import { defineCollection } from '@tachybase/database';

// 登录失败记录
export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: 'passwordPolicyConfig',
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'integer',
      name: 'windowSeconds', // 规定时间:秒
    },
    {
      type: 'integer',
      name: 'maxAttempts', // 规定时间内最大尝试次数
    },
    {
      type: 'integer',
      name: 'blockSeconds', // 锁定时长:秒
    },
  ],
});
