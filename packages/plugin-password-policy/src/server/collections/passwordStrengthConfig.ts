import { defineCollection } from '@tachybase/database';

// 密码强度配置
export default defineCollection({
  dumpRules: {
    group: 'user',
  },
  name: 'passwordStrengthConfig',
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'integer',
      name: 'minLength', // 最小长度
      defaultValue: 8,
    },
    {
      type: 'integer',
      name: 'strengthLevel', // 强度级别：0-不限制，1-字母和数字，2-字母数字符号，3-数字大小写字母，4-数字大小写字母符号，5-三种以上字符
      defaultValue: 0,
    },
    {
      type: 'boolean',
      name: 'notContainUsername', // 不能包含用户名
      defaultValue: false,
    },
    {
      type: 'integer',
      name: 'historyCount', // 历史密码记录数量，0表示不限制
      defaultValue: 0,
    },
  ],
});
