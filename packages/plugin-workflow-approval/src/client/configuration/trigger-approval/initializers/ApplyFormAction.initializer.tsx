import { SchemaInitializer } from '@tachybase/client';

import { NAMESPACE } from '../../../locale';
import { APPROVAL_STATUS } from '../../../usage/pc/constants';
import { ApplyFormActionCommon } from './ApplyFormActionCommon';
import { ApplyFormActionReminder } from './ApplyFormActionReminder';
import { ApplyFormActionReSubmit } from './ApplyFormActionReSubmit';

// 卡片-配置操作
export const ApplyFormActionInitializer = new SchemaInitializer({
  name: 'ApplyFormActionInitializer',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: 'submit',
      type: 'item',
      title: '{{t("Submit")}}',
      Component: ApplyFormActionCommon,
      action: APPROVAL_STATUS.SUBMITTED,
      actionProps: { type: 'primary' },
      disabled: true,
    },
    {
      name: 'save',
      type: 'item',
      title: `{{t("Save draft", { ns: "${NAMESPACE}" })}}`,
      Component: ApplyFormActionCommon,
      action: APPROVAL_STATUS.DRAFT,
    },
    {
      name: 'Resubmit',
      type: 'item',
      title: `{{t("Resubmit", { ns: "${NAMESPACE}" })}}`,
      action: APPROVAL_STATUS.RESUBMIT,
      Component: ApplyFormActionReSubmit,
    },
    {
      name: 'reminder',
      type: 'item',
      title: `{{t("Reminder", { ns: "${NAMESPACE}" })}}`,
      Component: ApplyFormActionReminder,
    },
  ],
});
