import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { NodeColumn } from '../../approval-common/approval-columns/node.column';
import { ApprovalRecordStatusColumn } from '../../approval-common/approval-columns/status.column';
import { UserColumn } from '../../approval-common/approval-columns/user.column';
import { WorkflowColumn } from '../../approval-common/approval-columns/workflow.column';
import { SchemaApprovalBlockTodos } from './Sm.ApprovalBlockTodos';

// 审批-待办
export const ApprovalBlockTodos = () => (
  <SchemaComponent
    components={{
      NodeColumn,
      WorkflowColumn,
      UserColumn,
      ApprovalRecordStatusColumn,
    }}
    schema={SchemaApprovalBlockTodos}
  />
);
