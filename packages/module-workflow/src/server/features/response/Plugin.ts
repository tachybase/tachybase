import { Plugin } from '@tachybase/server';

import PluginWorkflowServer from '../../Plugin';
import { ResponseInstruction } from './ResponseMessageInstruction';

export class PluginResponse extends Plugin {
  async load() {
    const workflowPlugin = this.app.pm.get(PluginWorkflowServer) as PluginWorkflowServer;
    workflowPlugin.registerInstruction('response-message', ResponseInstruction);
  }
}
