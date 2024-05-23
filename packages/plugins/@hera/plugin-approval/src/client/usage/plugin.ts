import { Plugin } from '@tachybase/client';

import { KitApprovalBlock } from './approval-block/plugin';
import { KitApprovalRecordBlock } from './approval-record-block/plugin';

export class KitApprovalUsage extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalRecordBlock);
    this.pm.add(KitApprovalBlock);
  }
}
