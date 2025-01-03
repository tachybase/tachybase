import React from 'react';
import { WorkflowPane } from '@tachybase/module-workflow/client';

import { tval } from '../locale';
import { schemaApprovalPanne as schema } from './ApprovalPane.schema';

export const systemSettingName = 'system-approval';

export const settingApproval = {
  title: tval('Approval'),
  icon: 'approval',
  Component: () => <WorkflowPane schema={schema} />,
  aclSnippet: 'pm.workflow.workflows',
  sort: 4,
};
