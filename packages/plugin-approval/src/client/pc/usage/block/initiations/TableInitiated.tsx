import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { NodeColumn } from '../../common/approval-columns/node.column';
import { UserColumn } from '../../common/approval-columns/user.column';
import { WorkflowColumn } from '../../common/approval-columns/workflow.column';
import { ApplyButton } from './apply-button/VC.ApplyButton';
import { schemaTableInitiated as schema } from './TableInitiated.schema';

/**
 * DOC:
 * 区块初始化组件: 审批: 我的发起
 */
export const ViewTableInitiated = () => {
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
