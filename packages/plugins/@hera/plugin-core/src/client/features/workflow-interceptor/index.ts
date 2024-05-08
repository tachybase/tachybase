import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/plugin-workflow/client';
import { WorkflowTriggerInterceptor } from './WorkflowTriggerInterceptor';

export class PluginWorkflowInterceptor extends Plugin {
  async load() {
    const plugin = this.app.pm.get(PluginWorkflow) as PluginWorkflow;
    plugin.registerTrigger('request-interception', WorkflowTriggerInterceptor);
  }
}
