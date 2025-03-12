import { defineCollection } from '@tachybase/database';

// 登录失败记录
export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: 'passwordPolicy',
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
      name: 'lockSeconds', // 锁定时长:秒
    },
    {
      type: 'boolean',
      name: 'strictLock', // 严格锁定,被锁定后限制使用,而不仅仅是限制登录
    },
  ],
});
