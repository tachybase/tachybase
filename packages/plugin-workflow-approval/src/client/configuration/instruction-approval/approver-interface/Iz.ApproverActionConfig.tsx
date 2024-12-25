import { SchemaInitializer } from '@tachybase/client';

import { NAMESPACE } from '../../../locale';
import { APPROVAL_ACTION_STATUS } from '../../../pc/constants';
import { ApprovalActionConfigComponent } from './VC.ApprovalActionConfig';

export const ApproverActionConfigInitializer = new SchemaInitializer({
  name: 'ApproverActionConfigInitializer',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: `action-${APPROVAL_ACTION_STATUS.APPROVED}`,
      type: 'item',
      title: `{{t("Approve", { ns: "${NAMESPACE}" })}}`,
      Component: ApprovalActionConfigComponent,
      action: APPROVAL_ACTION_STATUS.APPROVED,
      actionProps: { type: 'primary' },
    },
    {
      name: `action-${APPROVAL_ACTION_STATUS.REJECTED}`,
      type: 'item',
      title: `{{t("Reject", { ns: "${NAMESPACE}" })}}`,
      Component: ApprovalActionConfigComponent,
      action: APPROVAL_ACTION_STATUS.REJECTED,
      actionProps: { danger: true },
    },
    {
      name: `action-${APPROVAL_ACTION_STATUS.RETURNED}`,
      type: 'item',
      title: `{{t("Return", { ns: "${NAMESPACE}" })}}`,
      Component: ApprovalActionConfigComponent,
      action: APPROVAL_ACTION_STATUS.RETURNED,
    },
  ],
});
