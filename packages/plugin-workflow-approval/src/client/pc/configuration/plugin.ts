import { Plugin } from '@tachybase/client';

import { settingApproval, systemSettingName } from './Approval.setting';
import { KitApprovalInstruction } from './instruction-approval/kit';
import { KitCarbonCopy } from './instruction-carbon-copy/kit';
import { KitApprovalTrigger } from './trigger/plugin';

export default class KitApprovalConfiguration extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalTrigger);
    this.pm.add(KitApprovalInstruction);
    // 审批抄送
    this.pm.add(KitCarbonCopy);
  }

  async load() {
    this.app.systemSettingsManager.add(systemSettingName, settingApproval);
  }
}
