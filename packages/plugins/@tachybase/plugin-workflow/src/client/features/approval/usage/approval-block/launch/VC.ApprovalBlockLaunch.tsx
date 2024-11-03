import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { NodeColumn } from '../../approval-common/approval-columns/node.column';
import { UserColumn } from '../../approval-common/approval-columns/user.column';
import { WorkflowColumn } from '../../approval-common/approval-columns/workflow.column';
import { ApplyButton } from './apply-button/VC.ApplyButton';
import { SchemaApprovalBlockLaunch } from './Sm.ApprovalBlockLaunch';

// 审批-发起: 卡片表格
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
