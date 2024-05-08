import { SchemaComponent } from '@tachybase/client';
import React from 'react';
import { NodeColumn } from '../../approval-common/approval-columns/column.node';
import { ApprovalRecordStatusColumn } from '../../approval-common/approval-columns/column.status';
import { UserColumn } from '../../approval-common/approval-columns/column.user';
import { WorkflowColumn } from '../../approval-common/approval-columns/column.workflow';
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
