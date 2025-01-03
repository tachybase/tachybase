import { Plugin } from '@tachybase/client';

import { KitApprovalBlock } from './block/kit';
import { KitApprovalRecordBlock } from './record-block/plugin';

export class KitApprovalPC extends Plugin {
  async afterAdd() {
    // 页面区块
    this.pm.add(KitApprovalBlock);
    // 记录区块
    this.pm.add(KitApprovalRecordBlock);
  }
}
