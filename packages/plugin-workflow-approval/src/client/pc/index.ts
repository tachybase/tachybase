import { Plugin } from '@tachybase/client';

import KitApprovalUsage from './usage/plugin';

export class PluginApprovalPC extends Plugin {
  async afterAdd() {
    // 审批用户界面
    this.pm.add(KitApprovalUsage);
  }
}

export default PluginApprovalPC;
