import { tval } from '../locale';
import { ApprovalPane } from './ApprovalPane.component';

export const systemSettingName = 'system-approval';

export const settingApproval = {
  title: tval('Approval'),
  icon: 'approval',
  Component: ApprovalPane,
  aclSnippet: 'pm.workflow.workflows',
  sort: 4,
};
