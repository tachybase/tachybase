import { Plugin } from '@nocobase/client';
import PluginWorkflow from '@tachybase/plugin-workflow/client';
import { ApprovalTrigger } from './node.ApprovalTrigger';
import { LauncherActionConfigInitializer } from './launcher-interface/Iz.LauncherActionConfig';
import { LauncherAddBlockButtonIntializer } from './launcher-interface/Iz.LauncherAddBlockButton';

export default class PluginKitApprovalTrigger extends Plugin {
  async afterAdd() {}
  async beforeLoad() {}
  async load() {
    const workflowPlugin = this.app.pm.get(PluginWorkflow);
    workflowPlugin.registerTrigger('approval', ApprovalTrigger);

    this.app.schemaInitializerManager.add(LauncherActionConfigInitializer);
    this.app.schemaInitializerManager.add(LauncherAddBlockButtonIntializer);
  }
}
