import { SchemaInitializer } from '@tachybase/client';

import { NAMESPACE } from '../../../locale';
import { APPROVAL_ACTION_STATUS } from '../../../usage/pc/constants';
import { ApproverActionCommon } from './ApproverActionCommon';

export const ApproverActionInitializer = new SchemaInitializer({
  name: 'ApproverActionInitializer',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: `action-${APPROVAL_ACTION_STATUS.APPROVED}`,
      type: 'item',
      title: `{{t("Approve", { ns: "${NAMESPACE}" })}}`,
      Component: ApproverActionCommon,
      action: APPROVAL_ACTION_STATUS.APPROVED,
      actionProps: { type: 'primary' },
    },
    {
      name: `action-${APPROVAL_ACTION_STATUS.REJECTED}`,
      type: 'item',
      title: `{{t("Reject", { ns: "${NAMESPACE}" })}}`,
      Component: ApproverActionCommon,
      action: APPROVAL_ACTION_STATUS.REJECTED,
      actionProps: { danger: true },
    },
    {
      name: `action-${APPROVAL_ACTION_STATUS.RETURNED}`,
      type: 'item',
      title: `{{t("Return", { ns: "${NAMESPACE}" })}}`,
      Component: ApproverActionCommon,
      action: APPROVAL_ACTION_STATUS.RETURNED,
    },
  ],
});
