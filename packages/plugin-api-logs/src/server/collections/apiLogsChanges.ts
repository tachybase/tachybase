import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'log',
  },
  name: 'apiLogsChanges',
  title: '数据变动值',
  createdBy: false,
  updatedBy: false,
  createdAt: false,
  updatedAt: false,
  shared: true,
  fields: [
    {
      type: 'json',
      name: 'field',
    },
    {
      type: 'json',
      name: 'before',
    },
    {
      type: 'json',
      name: 'after',
    },
    {
      type: 'belongsTo',
      name: 'log',
      target: 'apiLogs',
      foreignKey: 'apiLogId',
    },
  ],
});
