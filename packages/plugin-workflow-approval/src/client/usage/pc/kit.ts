import { Plugin } from '@tachybase/client';

import KitApprovalUsage from './usage/kit';

export class KitApprovalPC extends Plugin {
  async afterAdd() {
    // 审批用户界面
    this.pm.add(KitApprovalUsage);
  }
}
