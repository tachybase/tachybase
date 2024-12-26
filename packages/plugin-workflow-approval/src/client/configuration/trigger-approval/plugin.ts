import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import { ApprovalTrigger } from './Approval.trigger';
import { LauncherActionConfigInitializer } from './launcher-interface/LauncherActionConfig.initializer';
import { LauncherAddBlockButtonIntializer } from './launcher-interface/LauncherAddBlockButton.initializer';

export class KitApprovalTrigger extends Plugin {
  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerTrigger('approval', ApprovalTrigger);

    this.app.schemaInitializerManager.add(LauncherActionConfigInitializer);
    this.app.schemaInitializerManager.add(LauncherAddBlockButtonIntializer);
  }
}
