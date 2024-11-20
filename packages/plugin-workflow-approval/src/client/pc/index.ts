import { Plugin } from '@tachybase/client';

import KitApprovalConfiguration from './configuration/plugin';
import KitApprovalUsage from './usage/plugin';

export class PluginApprovalPC extends Plugin {
  async afterAdd() {
    // 审批配置
    this.pm.add(KitApprovalConfiguration);
    // 审批用户界面
    this.pm.add(KitApprovalUsage);
  }
}

export default PluginApprovalPC;
