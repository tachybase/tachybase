import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import { ApprovalInstruction } from './Approval.instruction';
import { ApproverActionConfigInitializer } from './approver-interface/ApproverActionConfig.initializer';
import { ApproverAddBlockInitializer } from './approver-interface/ApproverAddBlock.initializer';
import { KitApprovalAddActionButton } from './forms/FormBlock.factory';

export class KitApprovalInstruction extends Plugin {
  async afterAdd(): Promise<void> {
    this.pm.add(KitApprovalAddActionButton);
  }

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction('approval', ApprovalInstruction);

    this.app.schemaInitializerManager.add(ApproverActionConfigInitializer);
    this.app.schemaInitializerManager.add(ApproverAddBlockInitializer);
  }
}
