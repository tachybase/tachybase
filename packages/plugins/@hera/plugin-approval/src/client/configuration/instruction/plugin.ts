import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/plugin-workflow/client';

import { ApproverActionConfigInitializer } from './approver-interface/Iz.ApproverActionConfig';
import { ApproverAddBlockInitializer } from './approver-interface/Iz.ApproverAddBlock';
import { ApprovalInstruction } from './node.ApprovalInstruction';

export class KitApprovalInstruction extends Plugin {
  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction('approval', ApprovalInstruction);

    this.app.schemaInitializerManager.add(ApproverActionConfigInitializer);
    this.app.schemaInitializerManager.add(ApproverAddBlockInitializer);
  }
}
