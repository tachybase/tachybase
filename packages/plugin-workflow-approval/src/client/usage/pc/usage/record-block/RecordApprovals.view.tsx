import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { ApprovalRecordStatusColumn } from '../common/approval-columns/status.column';
import { UserColumn } from '../common/approval-columns/user.column';
import { WorkflowColumn } from '../common/approval-columns/workflow.column';
import { SchemaRecordApprovals } from './RecordApprovals.schema';

// 视图组件,添加卡片-相关审批
export const RecordApprovals = () => {
  return (
    <SchemaComponent
      components={{
        WorkflowColumn: WorkflowColumn,
        UserColumn: UserColumn,
        ApprovalRecordStatusColumn: ApprovalRecordStatusColumn,
      }}
      schema={SchemaRecordApprovals}
    />
  );
};
