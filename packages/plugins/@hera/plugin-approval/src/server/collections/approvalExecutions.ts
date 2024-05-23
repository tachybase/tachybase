import { defineCollection } from '@tachybase/database';

// 审批
export default defineCollection({
  namespace: 'workflow.approvalExecutions',
  dumpRules: 'required',
  name: 'approvalExecutions',
  fields: [
    {
      type: 'string',
      name: 'collectionName',
    },
    {
      type: 'bigInt',
      name: 'id',
      primaryKey: true,
      autoIncrement: true,
    },
    {
      type: 'belongsTo',
      name: 'approval',
      foreignKey: 'approvalId',
      primaryKey: false,
    },
    {
      type: 'belongsTo',
      name: 'execution',
      foreignKey: 'executionId',
      primaryKey: false,
    },
    {
      type: 'integer',
      name: 'status',
    },
    {
      type: 'jsonb',
      name: 'snapshot',
    },
    {
      type: 'jsonb',
      name: 'summary',
      defaultValue: {},
    },
    {
      type: 'hasMany',
      name: 'records',
      target: 'approvalRecords',
    },
  ],
});
