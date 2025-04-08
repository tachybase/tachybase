import { SchemaInitializer } from '@tachybase/client';

import { APPROVAL_TODO_STATUS } from '../../../common/constants/approval-todo-status';
import { NAMESPACE } from '../../../locale';
import { ApproverActionCommon } from './ApproverActionCommon';

export const ApproverActionInitializer = new SchemaInitializer({
  name: 'ApproverActionInitializer',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: `action-${APPROVAL_TODO_STATUS.APPROVED}`,
      type: 'item',
      title: `{{t("Approve", { ns: "${NAMESPACE}" })}}`,
      Component: ApproverActionCommon,
      action: APPROVAL_TODO_STATUS.APPROVED,
      actionProps: { type: 'primary' },
    },
    {
      name: `action-${APPROVAL_TODO_STATUS.REJECTED}`,
      type: 'item',
      title: `{{t("Reject", { ns: "${NAMESPACE}" })}}`,
      Component: ApproverActionCommon,
      action: APPROVAL_TODO_STATUS.REJECTED,
      actionProps: { danger: true },
    },
    {
      name: `action-${APPROVAL_TODO_STATUS.RETURNED}`,
      type: 'item',
      title: `{{t("Return", { ns: "${NAMESPACE}" })}}`,
      Component: ApproverActionCommon,
      action: APPROVAL_TODO_STATUS.RETURNED,
    },
  ],
});
