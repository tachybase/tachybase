import { defineCollection } from '@nocobase/database';

export default defineCollection({
  dumpRules: {
    group: 'required',
  },
  name: 'tokenConfiguration',
  title: '开放平台 Token 管理',
  fields: [
    {
      title: 'App ID',
      name: 'app_id',
      type: 'string',
    },
    {
      title: 'App Secret',
      name: 'app_secret',
      type: 'string',
    },
    {
      title: 'chat_id',
      comment: '暂时设置在这里',
      name: 'chat_id',
      type: 'string',
    },
    {
      title: 'Token Type',
      comment: '秘钥类型',
      name: 'type',
      type: 'string',
    },
  ],
});
