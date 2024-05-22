import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/plugin-workflow/client';
import { ApprovalInstruction } from './node.ApprovalInstruction';
import { ApproverActionConfigInitializer } from './approver-interface/Iz.ApproverActionConfig';
import { ApproverAddBlockInitializer } from './approver-interface/Iz.ApproverAddBlock';

export class KitApprovalInstruction extends Plugin {
  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction('approval', ApprovalInstruction);

    this.app.schemaInitializerManager.add(ApproverActionConfigInitializer);
    this.app.schemaInitializerManager.add(ApproverAddBlockInitializer);
  }
}
