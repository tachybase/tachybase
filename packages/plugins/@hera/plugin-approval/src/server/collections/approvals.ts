import { defineCollection } from '@nocobase/database';
export default defineCollection({
  namespace: 'workflow.approvals',
  duplicator: 'required',
  name: 'approvals',
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'string',
      name: 'collectionName',
    },
    {
      type: 'string',
      name: 'dataKey',
    },
    {
      type: 'belongsTo',
      name: 'workflow',
      onDelete: 'CASCADE',
    },
    {
      type: 'string',
      name: 'workflowKey',
    },
    {
      type: 'belongsToMany',
      name: 'executions',
      through: 'approvalExecutions',
      targetKey: 'id',
      sourceKey: 'id',
      foreignKey: 'approvalId',
      otherKey: 'executionId',
    },
    {
      type: 'hasMany',
      name: 'approvalExecutions',
      target: 'approvalExecutions',
      onDelete: 'CASCADE',
    },
    {
      type: 'belongsTo',
      name: 'latestApprovalExecution',
      target: 'approvalExecutions',
      foreignKey: 'latestExecutionId',
    },
    {
      type: 'hasMany',
      name: 'records',
      target: 'approvalRecords',
      onDelete: 'CASCADE',
    },
    {
      type: 'integer',
      name: 'status',
    },
    {
      type: 'json',
      name: 'data',
      defaultValue: {},
    },
    {
      type: 'belongsTo',
      name: 'applicantRole',
      foreignKey: 'applicantRoleName',
      target: 'roles',
    },
  ],
});
