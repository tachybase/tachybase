import { tval } from '../../locale';
import { WorkflowPane } from '../../WorkflowPane';

export const systemSettingName = 'workflow.approval';

export const settingApproval = {
  icon: 'approval',
  title: tval('Approval'),
  Component: WorkflowPane,
  aclSnippet: 'pm.workflow.workflows',
  sort: 100,
};
