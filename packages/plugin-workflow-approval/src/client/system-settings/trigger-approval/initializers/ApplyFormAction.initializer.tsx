import { SchemaInitializer } from '@tachybase/client';

import { APPROVAL_INITIATION_STATUS } from '../../../common/constants/approval-initiation-status';
import { NAMESPACE } from '../../../locale';
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
      action: APPROVAL_INITIATION_STATUS.SUBMITTED,
      actionProps: { type: 'primary' },
      disabled: true,
    },
    {
      name: 'save',
      type: 'item',
      title: `{{t("Save draft", { ns: "${NAMESPACE}" })}}`,
      Component: ApplyFormActionCommon,
      action: APPROVAL_INITIATION_STATUS.DRAFT,
    },
    {
      name: 'Resubmit',
      type: 'item',
      title: `{{t("Resubmit", { ns: "${NAMESPACE}" })}}`,
      action: APPROVAL_INITIATION_STATUS.RESUBMIT,
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

/**
 * @deprecated
 */
// 卡片-配置操作
export const LauncherActionConfigInitializer = new SchemaInitializer({
  name: 'LauncherActionConfigInitializer',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: 'submit',
      type: 'item',
      title: '{{t("Submit")}}',
      Component: ApplyFormActionCommon,
      action: APPROVAL_INITIATION_STATUS.SUBMITTED,
      actionProps: { type: 'primary' },
      disabled: true,
    },
    {
      name: 'save',
      type: 'item',
      title: `{{t("Save draft", { ns: "${NAMESPACE}" })}}`,
      Component: ApplyFormActionCommon,
      action: APPROVAL_INITIATION_STATUS.DRAFT,
    },
    {
      name: 'Resubmit',
      type: 'item',
      title: `{{t("Resubmit", { ns: "${NAMESPACE}" })}}`,
      action: APPROVAL_INITIATION_STATUS.RESUBMIT,
      Component: ApplyFormActionCommon,
    },
  ],
});
