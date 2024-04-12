import { SchemaInitializer } from '@nocobase/client';
import { NAMESPACE } from '../locale';
import { b, ie } from './refined';

export const ApprovalProcessAddActionButton = new SchemaInitializer({
  name: 'ApprovalProcessAddActionButton',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: `action-${b.APPROVED}`,
      type: 'item',
      title: `{{t("Approve", { ns: "${NAMESPACE}" })}}`,
      Component: ie,
      action: b.APPROVED,
      actionProps: { type: 'primary' },
    },
    {
      name: `action-${b.REJECTED}`,
      type: 'item',
      title: `{{t("Reject", { ns: "${NAMESPACE}" })}}`,
      Component: ie,
      action: b.REJECTED,
      actionProps: { danger: !0 },
    },
    {
      name: `action-${b.RETURNED}`,
      type: 'item',
      title: `{{t("Return", { ns: "${NAMESPACE}" })}}`,
      Component: ie,
      action: b.RETURNED,
    },
  ],
});
