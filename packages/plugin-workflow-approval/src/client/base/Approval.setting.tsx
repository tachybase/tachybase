import { WorkflowPane } from '@tachybase/module-workflow/client';

import { tval } from '../locale';
import { schemaApprovalPanne as schema } from './ApprovalPane.schema';
import { ColumnShowApprovalId } from './ColumnShowApprovalId';

export const systemSettingName = 'system-approval';

export const settingApproval = {
  title: tval('Approval flow'),
  icon: 'approval',
  Component: () => (
    <WorkflowPane
      schema={schema}
      components={{
        ColumnShowApprovalId,
      }}
    />
  ),
  aclSnippet: 'pm.workflow.workflows',
  sort: 4,
};
