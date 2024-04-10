import { SchemaInitializer } from '@nocobase/client';
import { NAMESPACE } from '../locale';
import { ke, X } from './refined';

export const ApprovalApplyAddActionButton = new SchemaInitializer({
  name: 'ApprovalApplyAddActionButton',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: 'submit',
      type: 'item',
      title: '{{t("Submit")}}',
      Component: ke,
      action: X.SUBMITTED,
      actionProps: { type: 'primary' },
      disabled: !0,
    },
    {
      name: 'save',
      type: 'item',
      title: `{{t("Save draft", { ns: "${NAMESPACE}" })}}`,
      Component: ke,
      action: X.DRAFT,
    },
  ],
});
