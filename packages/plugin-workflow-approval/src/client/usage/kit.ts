import { Plugin } from '@tachybase/client';

import { KitApprovalH5 } from './h5';
import { KitApprovalPC } from './pc/kit';

export class KitApprovalUsage extends Plugin {
  async load() {
    await this.app.pm.add(KitApprovalPC);
    await this.app.pm.add(KitApprovalH5);
  }
}
