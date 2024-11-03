import { SchemaInitializer } from '@tachybase/client';

import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from '../../constants';
import { NAMESPACE } from '../../locale';
import { LauncherActionConfigComponent } from './LauncherActionConfigComponent';

// 卡片-配置操作
export const LauncherActionConfigInitializer = new SchemaInitializer({
  name: 'ApprovalApplyAddActionButton',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: 'submit',
      type: 'item',
      title: '{{t("Submit")}}',
      Component: LauncherActionConfigComponent,
      action: APPROVAL_ACTION_STATUS.SUBMITTED,
      actionProps: { type: 'primary' },
      disabled: true,
    },
    {
      name: 'save',
      type: 'item',
      title: `{{t("Save draft", { ns: "${NAMESPACE}" })}}`,
      Component: LauncherActionConfigComponent,
      action: APPROVAL_ACTION_STATUS.DRAFT,
    },
  ],
});
