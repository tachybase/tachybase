import { SchemaInitializer } from '@tachybase/client';

import { APPROVAL_STATUS } from '../../../constants';
import { NAMESPACE } from '../../../locale';
import {
  LauncherActionConfigComponent,
  LauncherActionConfigReminder,
  LauncherActionConfigReSubmit,
} from './LauncherActionConfig.component';

// 卡片-配置操作
export const LauncherActionConfigInitializer = new SchemaInitializer({
  name: 'LauncherActionConfigInitializer',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: 'submit',
      type: 'item',
      title: '{{t("Submit")}}',
      Component: LauncherActionConfigComponent,
      action: APPROVAL_STATUS.SUBMITTED,
      actionProps: { type: 'primary' },
      disabled: true,
    },
    {
      name: 'save',
      type: 'item',
      title: `{{t("Save draft", { ns: "${NAMESPACE}" })}}`,
      Component: LauncherActionConfigComponent,
      action: APPROVAL_STATUS.DRAFT,
    },
    {
      name: 'Resubmit',
      type: 'item',
      title: `{{t("Resubmit", { ns: "${NAMESPACE}" })}}`,
      action: APPROVAL_STATUS.RESUBMIT,
      Component: LauncherActionConfigReSubmit,
    },
    {
      name: 'reminder',
      type: 'item',
      title: `{{t("Reminder", { ns: "${NAMESPACE}" })}}`,
      Component: LauncherActionConfigReminder,
    },
  ],
});
