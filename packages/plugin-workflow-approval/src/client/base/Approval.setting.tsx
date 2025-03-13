import { ExecutionRetryAction, WorkflowPane } from '@tachybase/module-workflow/client';

import { tval } from '../locale';
import { schemaApprovalPanne as schema } from './ApprovalPane.schema';
import { ColumnShowApprovalId } from './ColumnShowApprovalId';

export const systemSettingName = 'workflow-approval';

export const settingApproval = {
  title: tval('Approval flow'),
  icon: 'approval',
  Component: () => (
    <WorkflowPane
      schema={schema}
      components={{
        ColumnShowApprovalId,
      }}
      scope={{
        ExecutionRetryAction,
      }}
    />
  ),
  aclSnippet: 'pm.workflow.workflows',
  sort: -10,
};
