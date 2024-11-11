import { defineCollection } from '@tachybase/database';

// 跟随core插件，消息通知表
export default defineCollection({
  dumpRules: {
    group: 'required',
  },
  name: 'system_message',
  title: '消息通知',
  createdBy: true,
  updatedBy: true,
  origin: '@hera/plugin-core',
  fields: [
    {
      title: '已读',
      name: 'read',
      type: 'boolean',
      interface: 'checkbox',
      parentKey: null,
      reverseKey: null,
      uiSchema: {
        type: 'boolean',
        'x-component': 'Checkbox',
        title: '是否启用(勾选)',
      },
    },
    {
      title: '代办',
      name: 'title',
      type: 'string',
    },
    {
      title: '内容',
      name: 'content',
      type: 'string',
    },
    {
      interface: 'm2o',
      type: 'belongsTo',
      name: '用户',
      target: 'users',
      sourceKey: 'id',
      foreignKey: 'user_id',
      onDelete: 'SET NUll',
    },
  ],
});
