import { defineCollection } from '@tachybase/database';

import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../common/constants';

// 审批-抄送
export default defineCollection({
  namespace: 'workflow.approvalCarbonCopy',
  dumpRules: 'required',
  name: COLLECTION_NAME_APPROVAL_CARBON_COPY,
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'string',
      name: 'collectionName',
    },
    {
      type: 'string',
      name: 'index',
    },
    {
      type: 'string',
      name: 'dataKey',
    },
    {
      type: 'belongsTo',
      name: 'approval',
    },
    {
      type: 'integer',
      name: 'status',
    },

    {
      type: 'belongsTo',
      name: 'user',
      target: 'users',
    },
    {
      type: 'belongsTo',
      name: 'workflow',
      onDelete: 'CASCADE',
    },

    {
      type: 'belongsTo',
      name: 'execution',
    },
    {
      type: 'belongsTo',
      name: 'node',
      target: 'flow_nodes',
    },
    {
      type: 'belongsTo',
      name: 'job',
      target: 'jobs',
    },
    {
      type: 'jsonb',
      name: 'summary',
      defaultValue: {},
    },
    {
      type: 'jsonb',
      name: 'snapshot',
      defaultValue: {},
    },
  ],
});
