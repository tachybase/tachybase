import { defineCollection } from '@tachybase/database';
import { COLLECTION_NOTICE_NAME } from '../../common/constants';

export const COLLECTION_WORKFLOWS_NAME = 'workflows';

const WorkflowNotice = defineCollection({
  namespace: 'workflow.notice',
  dumpRules: 'required',
  name: COLLECTION_NOTICE_NAME,
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
      type: 'string',
      name: 'index',
    },
    {
      type: 'integer',
      name: 'status',
    },
    {
      type: 'jsonb',
      name: 'snapshot',
      defaultValue: {},
    },
    {
      type: 'jsonb',
      name: 'summary',
      defaultValue: {},
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
  ],
});

export default WorkflowNotice;
