import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import { INSTRUCTION_TYPE_NAME_APPROVAL } from '../../../common/constants';
import { ApprovalInstruction } from './Approval.instruction';
import { ApproverActionConfigInitializer } from './components/approver-interface/ApproverActionConfig.initializer';
import { ApproverAddBlockInitializer } from './components/approver-interface/ApproverAddBlock.initializer';
import { KitApprovalAddActionButton } from './forms/FormBlock.factory';

export class KitApprovalInstruction extends Plugin {
  async afterAdd(): Promise<void> {
    this.pm.add(KitApprovalAddActionButton);
  }

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction(INSTRUCTION_TYPE_NAME_APPROVAL, ApprovalInstruction);

    this.app.schemaInitializerManager.add(ApproverActionConfigInitializer);
    this.app.schemaInitializerManager.add(ApproverAddBlockInitializer);
  }
}
