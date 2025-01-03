import { Plugin } from '@tachybase/client';

import { settingApproval, systemSettingName } from './Approval.setting';

// 审批-系统设置项-审批入口/审批表格展示
export class KitApprovalBase extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('business-components' + '.' + systemSettingName, settingApproval);
  }
}
