import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { NodeColumn } from '../../approval-common/approval-columns/column.node';
import { UserColumn } from '../../approval-common/approval-columns/column.user';
import { WorkflowColumn } from '../../approval-common/approval-columns/column.workflow';
import { ApplyButton } from './apply-button/VC.ApplyButton';
import { SchemaApprovalBlockLaunch } from './Sm.ApprovalBlockLaunch';

// 审批-发起: 区块表格
export const ApprovalBlockLaunch = () => {
  return (
    <SchemaComponent
      components={{
        NodeColumn,
        WorkflowColumn,
        UserColumn,
        ApplyButton,
      }}
      schema={SchemaApprovalBlockLaunch}
    />
  );
};
