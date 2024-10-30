import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { ApprovalRecordStatusColumn } from '../approval-common/approval-columns/status.column';
import { UserColumn } from '../approval-common/approval-columns/user.column';
import { WorkflowColumn } from '../approval-common/approval-columns/workflow.column';
import { SchemaRecordApprovals } from './RecordApprovals.schema';

// 视图组件,添加区块-相关审批
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
