import { Plugin } from '@tachybase/client';
import { KitApprovalInstruction } from './instruction/plugin';
import { KitApprovalTrigger } from './trigger/plugin';

export default class KitApprovalConfiguration extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalTrigger);
    this.pm.add(KitApprovalInstruction);
  }
}
