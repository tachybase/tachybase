import { ApprovalPane } from './ApprovalPane.component';
import { tval } from './locale';

export const systemSettingName = 'system-approval';

export const settingApproval = {
  title: tval('Approval'),
  icon: 'approval',
  Component: ApprovalPane,
  aclSnippet: 'pm.workflow.workflows',
  sort: 4,
};
