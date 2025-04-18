import { Plugin } from '@tachybase/client';

import { KitApprovalInstruction } from './instruction-approval/kit';
import { KitCarbonCopy } from './instruction-carbon-copy/kit';
import { KitApprovalTrigger } from './trigger-approval/kit';

// 审批配置项-工作流触发器和节点
export default class KitApprovalConfiguration extends Plugin {
  async afterAdd() {
    // 审批事件触发器
    this.pm.add(KitApprovalTrigger);
    // 审批节点
    this.pm.add(KitApprovalInstruction);
    // 审批抄送节点
    this.pm.add(KitCarbonCopy);
  }
}
