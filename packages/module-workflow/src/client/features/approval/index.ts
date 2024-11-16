import { Plugin } from '@tachybase/client';

import { settingApproval, systemSettingName } from './Approval.setting';
import { KitCarbonCopy } from './configuration/instruction-carbon-copy/kit';
import KitApprovalConfiguration from './configuration/plugin';
import { KitApprovalUsage } from './usage/plugin';

export class PluginApproval extends Plugin {
  async afterAdd() {
    // 审批配置
    this.pm.add(KitApprovalConfiguration);
    // 审批用户界面
    this.pm.add(KitApprovalUsage);

    // 审批抄送
    this.pm.add(KitCarbonCopy);
  }
  async load() {
    this.app.systemSettingsManager.add(systemSettingName, settingApproval);
  }
}

export default PluginApproval;
