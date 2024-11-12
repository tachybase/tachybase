import { Plugin } from '@tachybase/server';

import PluginWorkflowServer from '../../Plugin';
import { OmniTrigger } from './CustomActionTrigger';

export class PluginOmniTrigger extends Plugin {
  async load() {
    const workflowPlugin = this.app.pm.get(PluginWorkflowServer) as PluginWorkflowServer;
    workflowPlugin.registerTrigger('general-action', OmniTrigger);
  }
}
