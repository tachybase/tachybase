import { Plugin } from '@nocobase/client';
import PluginWorkflow from '@tachybase/plugin-workflow/client';
import { ApprovalInstruction } from './node.ApprovalInstruction';
import { ApproverActionConfigInitializer } from './approver-interface/Iz.ApproverActionConfig';
import { ApproverAddBlockInitializer } from './approver-interface/Iz.ApproverAddBlock';

export default class PluginKitApprovalInstruction extends Plugin {
  async afterAdd() {}
  async beforeLoad() {}
  async load() {
    const workflowPlugin = this.app.pm.get(PluginWorkflow);
    workflowPlugin.registerInstruction('approval', ApprovalInstruction);

    this.app.schemaInitializerManager.add(ApproverActionConfigInitializer);
    this.app.schemaInitializerManager.add(ApproverAddBlockInitializer);
  }
}
