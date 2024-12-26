import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import { PLUGIN_NAME_APPROVAL } from '../../../common/constants';
import { ApprovalTrigger } from './Approval.trigger';
import { KitApprovalTriggerInitializer } from './initializers/kit';

export class KitApprovalTrigger extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitApprovalTriggerInitializer);
  }

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerTrigger(PLUGIN_NAME_APPROVAL, ApprovalTrigger);
  }
}
