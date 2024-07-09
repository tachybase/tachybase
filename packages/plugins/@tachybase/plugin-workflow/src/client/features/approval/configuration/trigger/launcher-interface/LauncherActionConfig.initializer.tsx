import { SchemaInitializer } from '@tachybase/client';

import { APPROVAL_STATUS } from '../../../constants';
import { NAMESPACE } from '../../../locale';
import { LauncherActionConfigComponent, LauncherActionConfigReSubmit } from './LauncherActionConfig.component';

// 区块-配置操作
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
      title: `{{t("resubmit", { ns: "${NAMESPACE}" })}}`,
      action: APPROVAL_STATUS.RESUBMIT,
      Component: LauncherActionConfigReSubmit,
    },
  ],
});
