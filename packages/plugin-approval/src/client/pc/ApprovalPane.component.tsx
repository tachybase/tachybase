import React from 'react';
import { WorkflowPane } from '@tachybase/module-workflow/client';

import { schemaApprovalPanne as schema } from './ApprovalPanne.schema';

// 系统设置: 审批, 列表
export const ApprovalPane = () => {
  return <WorkflowPane schema={schema} />;
};
