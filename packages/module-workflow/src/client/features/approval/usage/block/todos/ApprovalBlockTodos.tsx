import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { NodeColumn } from '../../common/approval-columns/node.column';
import { ApprovalRecordStatusColumn } from '../../common/approval-columns/status.column';
import { UserColumn } from '../../common/approval-columns/user.column';
import { WorkflowColumn } from '../../common/approval-columns/workflow.column';
import { schemaApprovalBlockTodos } from './ApprovalBlockTodos.schema';

// 审批-待办
export const ViewApprovalBlockTodos = () => (
  <SchemaComponent
    schema={schemaApprovalBlockTodos}
    components={{
      NodeColumn,
      WorkflowColumn,
      UserColumn,
      ApprovalRecordStatusColumn,
    }}
  />
);
