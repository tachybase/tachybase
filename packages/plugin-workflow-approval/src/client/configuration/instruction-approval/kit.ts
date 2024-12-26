import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import { INSTRUCTION_TYPE_NAME_APPROVAL } from '../../../common/constants';
import { ApprovalInstruction } from './Approval.instruction';
import { KitApprovalAddActionButton } from './forms/FormBlock.factory';
import { KitInstructionApprovalInitializer } from './initializers/kit';

export class KitApprovalInstruction extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitApprovalAddActionButton);
    await this.app.pm.add(KitInstructionApprovalInitializer);
  }

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction(INSTRUCTION_TYPE_NAME_APPROVAL, ApprovalInstruction);
  }
}
