import { Plugin } from '@tachybase/client';

import { KitApprovalBlock } from './block/plugin';
import { KitApprovalRecordBlock } from './record-block/plugin';

export class KitApprovalUsage extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalRecordBlock);
    this.pm.add(KitApprovalBlock);
  }
}
