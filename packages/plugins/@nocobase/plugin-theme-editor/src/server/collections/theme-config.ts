import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'themeConfig',
  dumpRules: 'required',
  fields: [
    // 主题配置内容，一个 JSON 字符串
    {
      type: 'json',
      name: 'config',
    },
    // 主题是否可选
    {
      type: 'boolean',
      name: 'optional',
    },
    {
      type: 'boolean',
      name: 'isBuiltIn',
    },
    {
      type: 'uid',
      name: 'uid',
    },
    {
      type: 'radio',
      name: 'default',
      defaultValue: false,
    },
  ],
});
