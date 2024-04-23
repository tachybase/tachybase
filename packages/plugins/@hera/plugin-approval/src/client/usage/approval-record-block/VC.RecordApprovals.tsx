import { SchemaComponent } from '@nocobase/client';
import React from 'react';
import { ApprovalRecordStatusColumn } from '../approval-common/approval-columns/column.status';
import { UserColumn } from '../approval-common/approval-columns/column.user';
import { WorkflowColumn } from '../approval-common/approval-columns/column.workflow';
import { SchemaRecordApprovals } from './Sm.RecordApprovals';

// 视图组件,创建区块-相关审批
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
