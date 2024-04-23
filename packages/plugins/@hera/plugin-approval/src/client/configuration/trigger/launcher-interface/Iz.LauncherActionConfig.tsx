import { SchemaInitializer } from '@nocobase/client';
import { NAMESPACE } from '../../../locale';
import { APPROVAL_STATUS } from '../../../constants';
import { LauncherActionConfigComponent } from './VC.LauncherActionConfig';

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
  ],
});
