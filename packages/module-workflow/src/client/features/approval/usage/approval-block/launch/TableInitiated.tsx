import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { NodeColumn } from '../../approval-common/approval-columns/node.column';
import { UserColumn } from '../../approval-common/approval-columns/user.column';
import { WorkflowColumn } from '../../approval-common/approval-columns/workflow.column';
import { ApplyButton } from './apply-button/VC.ApplyButton';
import { schemaTableInitiated as schema } from './TableInitiated.schema';

// 审批-发起: 我的发起 Table
export const TableInitiated = () => {
  return (
    <SchemaComponent
      schema={schema}
      components={{
        ApplyButton,
        NodeColumn,
        WorkflowColumn,
        UserColumn,
      }}
    />
  );
};
