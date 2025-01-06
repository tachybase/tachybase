import { Plugin } from '@tachybase/client';

import { KitApprovalH5 } from './h5/kit';
import { KitApprovalPC } from './pc/kit';

export class KitApprovalUsage extends Plugin {
  async load() {
    await this.app.pm.add(KitApprovalH5);
    await this.app.pm.add(KitApprovalPC);
  }
}
