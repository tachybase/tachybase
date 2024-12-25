import { Plugin } from '@tachybase/client';

import { settingApproval, systemSettingName } from './Approval.setting';
import { KitApprovalInstruction } from './instruction-approval/kit';
import { KitCarbonCopy } from './instruction-carbon-copy/kit';
import { KitApprovalTrigger } from './trigger-approval/plugin';

export default class KitApprovalConfiguration extends Plugin {
  async afterAdd() {
    // 审批事件触发器
    this.pm.add(KitApprovalTrigger);
    // 审批节点
    this.pm.add(KitApprovalInstruction);
    // 审批抄送节点
    this.pm.add(KitCarbonCopy);
  }

  async load() {
    this.app.systemSettingsManager.add('business-components.' + systemSettingName, settingApproval);
  }
}
