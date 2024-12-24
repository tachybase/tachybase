import { Plugin } from '@tachybase/client';

import { KitApprovalBlock } from './block/plugin';
import { KitApprovalRecordBlock } from './record-block/plugin';

class KitApprovalUsage extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalBlock);
    this.pm.add(KitApprovalRecordBlock);
  }
}

export default KitApprovalUsage;
