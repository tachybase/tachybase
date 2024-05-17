import { SchemaInitializer } from '@tachybase/client';
import { LauncherActionConfigComponent } from './LauncherActionConfigComponent';
import { NAMESPACE } from '../../locale';
import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from '../../constants';

// 区块-配置操作
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
