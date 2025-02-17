import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'log',
  },
  name: 'apiLogsChanges',
  title: '{{t("Data change value")}}',
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
