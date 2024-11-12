import { Plugin } from '@tachybase/client';

import { KitApprovalInstruction } from './instruction-approval/kit';
import { KitApprovalTrigger } from './trigger/plugin';

export default class KitApprovalConfiguration extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalTrigger);
    this.pm.add(KitApprovalInstruction);
  }
}
